import '@core/declarations'
import * as KafkaHelper from '@helpers/kafka.helper'
import { EventBroadcastStatus } from '@models/event'

export default async (_event: any) => {
  try {
    const event = await App.Models.Event.findById(_event)
    if (event) {
      try {
        const producer = new KafkaHelper.ProducerFactory({
          AppConfig: App.Config,
          topic: event.broadcastedEventName,
        })
        await producer.start()
        await producer.sendBatch([event.toObject()])
        await producer.shutdown()
        event.status = EventBroadcastStatus.Success
      } catch (kafkaError) {
        if (event.retryCount >= 4) {
          event.status = EventBroadcastStatus.GaveUp
        } else {
          event.retryCount++
          event.status = EventBroadcastStatus.Failed
        }
        Logger.error(kafkaError)
      }

      await event.save()
    }
  } catch (error) {
    Logger.error(error)
  }
}
