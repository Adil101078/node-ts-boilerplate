import '@core/declarations'
import { KAFKA_TOPICS } from '@core/constants/kafka-topics'
import { FetchCollectionFromOrigin, GenerateHashFrom } from '@core/utils'
import _ from 'lodash'

export default async (payload: any) => {
  const {
    partition,
    topic,
    message,
    heartbeat = () => {
      Logger.warn('Empty Heartbeat Function')
    },
  } = payload

  const eventHash: string = GenerateHashFrom([topic, partition, message.offset])
  const eventData = JSON.parse(message.value.toString())
  message.value = eventData

  let kafkaEvent = await App.Models.KafkaEvent.findOne({ eventHash })
    .select('eventHash')
    .lean()
  if (kafkaEvent) {
    return
  }

  kafkaEvent = await App.Models.KafkaEvent.create({
    eventHash,
    payload: {
      partition,
      topic,
      message,
    },
    executionStartedAt: Date.now(),
  })

  const kafkaEventServerStat = await App.Models.ServerStat.create({
    name: `processing-kafka-event-${eventHash}`,
    value: {
      eventHash,
    },
  })

  for (const iterator in KAFKA_TOPICS.GENERIC) {
    if (KAFKA_TOPICS.GENERIC[iterator] == topic) {
      const ModelName: string = _.startCase(_.camelCase(iterator)).replace(
        / /g,
        ''
      )
      await _GenericUpdateEventHandler(ModelName, eventData.payload, heartbeat)
    }
  }

  await heartbeat()

  kafkaEvent.executionEndedAt = Date.now()
  await kafkaEvent.save()

  await kafkaEventServerStat.remove()
}

const _GenericUpdateEventHandler = async (
  ModelName: any,
  eventData: any,
  heartbeat: CallableFunction
) => {
  // Check if user exists by Id
  let existingRecord = await App.Models[ModelName].findById(eventData._id)
  const isNew = eventData.wasNew
  let fetchedFromOrigin = false
  if (!existingRecord) {
    if (isNew) {
      existingRecord = await App.Models[ModelName].create(eventData)
    } else {
      // Try to fetch the data from origin microservice
      const originalCollectionData = await FetchCollectionFromOrigin(
        ModelName,
        eventData._id
      )
      fetchedFromOrigin = true
      await heartbeat()
      if (!originalCollectionData) {
        throw `Unable to fetch Original Collection Data for ${ModelName}:${eventData._id}`
      }
      existingRecord = await App.Models[ModelName].findById(eventData._id)
      if (!existingRecord) {
        existingRecord = await App.Models[ModelName].create(
          originalCollectionData
        )
      }
    }
  }

  if (!fetchedFromOrigin) {
    for (const key in eventData) {
      if (key == '_id') {
        continue
      }
      existingRecord[key] = eventData[key]
    }
    await heartbeat()
    await existingRecord.save()
  }

  if (isNew) {
    Logger.info(`${ModelName} created on kafka event - ${eventData._id}`)
  } else {
    Logger.info(`${ModelName} updated on kafka event - ${eventData._id}`)
  }
}
