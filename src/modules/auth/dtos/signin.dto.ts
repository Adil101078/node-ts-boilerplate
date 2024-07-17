import '@core/declarations'
import Joi from 'joi'

export const SignInWithPasswordGrantDTO = Joi.object({
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
  countryCode: Joi.when('phone', {
    is: Joi.exist(),
    then: Joi.required(),
  }),
  phone: Joi.string().min(3).max(16).pattern(/^\d+$/).optional(),
})
