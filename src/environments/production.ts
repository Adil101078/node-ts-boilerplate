import { ConfigInterface } from '@config'
// import { KAFKA_TOPICS } from '@core/constants/kafka-topics'
// import { GetBuildIdentifier, GetPackageJson } from '@core/utils'
// const BUILD_IDENTIFIER = GetBuildIdentifier()

const APP_PORT: number = parseInt(process.env.DEV_PORT)
const DOMAIN_NAME: string = process.env.DOMAIN_NAME ?? 'localhost'
const HTTP_PROTOCOL: string = process.env.HTTP_PROTOCOL ?? 'http'

// const KAFKA_BROKERS = []
// let HasBrokers = true
// while (HasBrokers) {
//   const brokerUrl = process.env[`KAFKA_BROKER_${KAFKA_BROKERS.length}`]
//   if (brokerUrl) {
//     KAFKA_BROKERS.push(brokerUrl)
//   } else {
//     HasBrokers = false
//   }
// }

export default (): ConfigInterface => {
  process.env['NODE_ENV'] = 'production'

  return {
    HOST:
      process.env.HOST ??
      `${HTTP_PROTOCOL}://${DOMAIN_NAME}${
        APP_PORT == 80 ? '' : `:${APP_PORT}`
      }`,
    PORT: APP_PORT,
    ENVIRONMENT: process.env['NODE_ENV'],
    DB_CONNECTION_STRING: process.env.DEV_DB_CONNECTION_STRING,
    DB_CONNECTION_OPTIONS: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },

    ITEMS_PER_PAGE: parseInt(process.env.ITEMS_PER_PAGE),
    SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,

    INTERNAL_COMMUNICATION_TOKEN: process.env.INTERNAL_COMMUNICATION_TOKEN,

    AWS: {
      ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
      REGION: process.env.AWS_REGION,
      SES_DEFAULT_FROM_EMAIL: process.env.AWS_SES_DEFAULT_FROM_EMAIL,
      APPLICATION_ID: process.env.AWS_APPLICATION_ID,
      BRAND_NAME: process.env.AWS_BRAND_NAME || 'Atomic People',
      ORIGINATION_IDENTITY: process.env.AWS_ORIGINATION_IDENTITY,
    },

    // KAFKA: {
    //   BROKERS: KAFKA_BROKERS,
    //   SUBSCRIBED_TOPICS: [...Object.values(KAFKA_TOPICS.GENERIC)],
    //   PRODUCER_CLIENT_ID:
    //     `dev-${GetPackageJson().name}-producer` + BUILD_IDENTIFIER,
    //   CONSUMER_CLIENT_ID:
    //     `dev-${GetPackageJson().name}-producer` + BUILD_IDENTIFIER,
    //   CONSUMER_GROUP_ID:
    //     `dev-${GetPackageJson().name}-consumer-group` + BUILD_IDENTIFIER,
    //   ENABLE_SSL: process.env.KAFKA_ENABLE_SSL == 'true',
    // },

    SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,

    TWO_FACTOR_AUTHENTICATION_CODE: {
      EXPIRATION_TIME:
        +process.env.TWO_FACTOR_AUTHENTICATION_CODE_EXPIRATION_TIME,
      EXPIRATION_TIME_UNIT:
        process.env.TWO_FACTOR_AUTHENTICATION_CODE_EXPIRATION_TIME_UNIT,
    },

    CODE_VERIFICATION: {
      LINK_TOKEN_LENGTH: +process.env.CODE_VERIFICATION_LINK_TOKEN_LENGTH || 50,

      EXPIRATION_TIME: +process.env.CODE_VERIFICATION_EXPIRATION_TIME, // in minutes
      EXPIRATION_TIME_UNIT: process.env.CODE_VERIFICATION_EXPIRATION_TIME_UNIT,

      EXPIRATION_TIME_FOR_PASSED_CODE:
        +process.env.CODE_VERIFICATION_EXPIRATION_TIME_FOR_PASSED_CODE, // in minutes
      EXPIRATION_TIME_FOR_PASSED_CODE_UNIT:
        process.env.CODE_VERIFICATION_EXPIRATION_TIME_FOR_PASSED_CODE_UNIT,

      RESEND_DURATION: JSON.parse(
        process.env.CODE_VERIFICATION_RESEND_DURATION
      ), // array of seconds [30, 40, 60 ...]
      RESEND_DURATION_UNIT: process.env.CODE_VERIFICATION_RESEND_DURATION_UNIT,

      RESEND_LIMIT_IN_SESSION:
        +process.env.CODE_VERIFICATION_RESEND_LIMIT_IN_SESSION,

      RESEND_SESSION_DURATION:
        +process.env.CODE_VERIFICATION_RESEND_SESSION_DURATION, // in minutes
      RESEND_SESSION_DURATION_UNIT:
        process.env.CODE_VERIFICATION_RESEND_SESSION_DURATION_UNIT,
    },

    SIGNIN: {
      INVALID_SIGNIN_ATTEMPTS_LIMIT: +process.env.SIGNIN_INVALID_ATTEMPTS_LIMIT,

      MULTIPLE_SIGNIN_ATTEMPTS_BLOCK_DURATION:
        +process.env.SIGNIN_MULTIPLE_ATTEMPTS_BLOCK_DURATION, // in hours
      MULTIPLE_SIGNIN_ATTEMPTS_BLOCK_DURATION_UNIT:
        process.env.SIGNIN_MULTIPLE_ATTEMPTS_BLOCK_DURATION_UNIT,
    },
  }
}
