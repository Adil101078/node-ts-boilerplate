import '@core/declarations'
import MongoId from '@helpers/object-id-validator.helper'
import Joi from 'joi'

export const ForgotPasswordResetDTO = Joi.object({
  _codeVerification: Joi.string()
    .custom(MongoId.Validate, 'ObjectId Validation')
    .required(),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!])[A-Za-z\d@!]+$/, {
      name: 'Password',
    })
    .message(
      'Invalid password: must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@!).'
    )
    .required(),
})
