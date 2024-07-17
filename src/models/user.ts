import '@core/declarations'
import { IBaseModel } from '@core/database'
import { Schema, model as Model } from 'mongoose'
import bcrypt from 'bcrypt'
import { Role } from '@core/constants/roles'
import { Models } from '@core/constants/database-models'

const ObjectId = Schema.Types.ObjectId

export enum TwoFactorAuthenticationSettings {
  AuthenticatorApp = 'AuthenticatorApp',
}

export interface IUser extends IBaseModel {
  firstName?: string
  lastName?: string
  parsedFullName?: string
  bio?: string
  dateOfBirth?: Date
  gender?: string
  email?: string
  emailVerifiedAt?: Date
  isSubscribed?: boolean
  phone?: string
  phoneVerifiedAt?: Date
  countryCode?: string
  password?: string
  isKYCVerified?: boolean
  accountType?: Role
  country?: string
  address?: {
    fullName: string
    houseName: string
    street: string
    city: string
    postalCode: string
    country: string
  }

  lastSigninAt?: Date
  accountMetadata?: {
    isBlocked?: boolean
    isBlockedByAdmin?: boolean
    unblocksAt?: Date
    customBlockMessage?: string
    isFirstTimeLogin?: boolean
  }

  twoFactorAuthentication: {
    isActivated: boolean
    authenticationType?: TwoFactorAuthenticationSettings
    code?: string
    expiresAt?: Date

    email?: string
    emailVerifiedAt?: Date

    phone?: string
    phoneVerifiedAt?: Date
    countryCode?: string

    authenticatorSecret?: string
    authenticatorSecretVerifiedAt?: Date
  }

  loginSessions?: {
    signinAt?: Date
    sessionIdentifier?: string
  }[]

  platFormBasedLoginCount?: { [key: string]: number }
  referral?: string

  security: {
    isFaceID?: boolean
    isFingerPrint?: boolean
  }
}

const schema = new Schema<IUser>(
  {
    firstName: { type: String, sparse: true },
    lastName: { type: String, sparse: true },
    parsedFullName: { type: String, select: false },

    dateOfBirth: Date,
    gender: String,

    email: { type: String, sparse: true },
    bio: { type: String, sparse: true },
    emailVerifiedAt: Date,
    isSubscribed: { type: Boolean, default: false },

    phone: { type: String, sparse: true },
    isKYCVerified: { type: Boolean, default: false },
    phoneVerifiedAt: Date,
    countryCode: String,
    country: String,

    address: {
      fullName: String,
      houseName: String,
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },

    password: { type: String, select: false },
    accountType: {
      type: String,
      enum: [Role.USER, Role.SUPER_ADMIN, Role.ADMIN],
      default: Role.USER,
    },

    lastSigninAt: Date,
    accountMetadata: {
      isBlocked: { type: Boolean, default: false },
      isBlockedByAdmin: { type: Boolean, default: false },
      unblocksAt: Date,
      customBlockMessage: String,
      isFirstLogin: { type: Boolean, default: true },
    },

    twoFactorAuthentication: {
      isActivated: { type: Boolean, default: false },
      authenticationType: {
        type: String,
        enum: Object.keys(TwoFactorAuthenticationSettings),
      },
      code: String,
      expiresAt: Date,
      email: String,
      phone: String,
      countryCode: String,
      authenticatorSecret: String,
    },

    loginSessions: [
      {
        _id: false,
        signinAt: Date,
        sessionIdentifier: String,
      },
    ],

    platFormBasedLoginCount: Schema.Types.Mixed,

    security: {
      isFaceID: { type: Boolean, default: false },
      isFingerPrint: { type: Boolean, default: false },
    },

    // From Base Model
    isActive: { type: Boolean, default: true },
    _createdBy: { type: ObjectId, ref: Models.User },
    _updatedBy: { type: ObjectId, ref: Models.User },
  },
  {
    autoIndex: true,
    versionKey: false,
    timestamps: true,
  }
)

schema.index(
  {
    _id: 1,
    'loginSessions.sessionIdentifier': 1,
  },
  { unique: true }
)

// Before Save Hook
schema.pre('save', async function () {
  // Hash password
  const { password } = this

  if (
    this.isModified('firstName') ||
    this.isModified('middleName') ||
    this.isModified('lastName')
  ) {
    this.parsedFullName = [this.firstName, this.lastName]
      .filter(Boolean)
      .join(' ')
  }

  // hashing password
  if (this.isModified('password')) {
    const hash = bcrypt.hashSync(password, App.Config.SALT_ROUNDS)
    this.password = hash
  }
})

/**
 * *************************************************
 *        S T A T I C   M E T H O D S
 * *************************************************
 */

// Function to check if any document exits with the given id
schema.static('findById', (value, projection = {}) => {
  return App.Models.User.findOne({ _id: value }, projection)
})

// Function to check if any document exits with the given username
schema.static('findByUsername', (username) => {
  return App.Models.User.findOne({ username })
})

// Function to check if any document exits with the given email
schema.static('findByEmail', (email) => {
  return App.Models.User.findOne({ email, isActive: true })
})

// Function to check if any document exits with the given phone
schema.static('findByPhone', (phone, countryCode) => {
  return App.Models.User.findOne({
    ..._.omitBy({ phone, countryCode }, _.isNil),
    isActive: true,
  })
})

/**
 * *************************************************
 *        I N S T A N C E   M E T H O D S
 * *************************************************
 */

// All Done
export const UserModel = Model<IUser>(Models.User, schema)
