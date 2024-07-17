import '@core/declarations'
import Joi from 'joi'

export const AvailabilityCheckDTO = Joi.object({
  email: Joi.string().email().optional(),
  phone: Joi.string().optional().max(16),
  countryCode: Joi.string().when('phone', {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
})
