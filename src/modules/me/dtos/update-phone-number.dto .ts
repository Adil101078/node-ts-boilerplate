import '@core/declarations'
import MongoId from '@helpers/object-id-validator.helper'
import Joi from 'joi'

export const UpdatePhoneNumberdDTO = Joi.object({
  _codeVerification: Joi.string()
    .custom(MongoId.Validate, 'ObjectId Validation')
    .required(),
})
