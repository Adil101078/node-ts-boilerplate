import '@core/declarations'
import { Role } from '@core/constants/roles'
import MongoId from '@helpers/object-id-validator.helper'
import Joi from 'joi'

export const SignUpDTO = Joi.object({
  _codeVerification: Joi.string()
    .custom(MongoId.Validate, 'ObjectId Validation')
    .required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().optional(),
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
  email: Joi.string().email().optional(),
  countryCode: Joi.string().max(4).optional(),
  phone: Joi.string().min(3).max(16).pattern(/^\d+$/).optional(),
  accountType: Joi.string().valid(Role.USER).required(),
  country: Joi.string().required(),
  dateOfBirth: Joi.date().optional(),
})
