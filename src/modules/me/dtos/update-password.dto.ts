import Joi from 'joi'

export const UpdatePasswordDTO = Joi.object({
  oldPassword: Joi.string()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!])[A-Za-z\d@!]+$/, {
      name: 'Password',
    })
    .message(
      'Invalid password: must contain at least one lowercase letter, one uppercase letter, one digit, and one special character (@!).'
    )
    .required(),
  newPassword: Joi.string()
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
