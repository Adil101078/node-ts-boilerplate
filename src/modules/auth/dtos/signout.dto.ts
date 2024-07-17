import '@core/declarations'
import Joi from 'joi'

export const SignOutDTO = Joi.object({
  signoutType: Joi.string().required(),
  sessionIdentifier: Joi.string().optional(),
})
