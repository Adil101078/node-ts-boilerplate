import '@core/declarations'
import requestValidator from '@helpers/request-validator.helper'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import UpdatePasswordDTO from '../dtos/update-password.dto'

export default async function _UpdatePassword(req: Request, res: Response) {
  // const errors = await requestValidator(UpdatePasswordDTO, req.body)
  // if (errors) {
  //   return res.unprocessableEntity({ errors })
  // }

  const { oldPassword, newPassword } = req.body
  const { user: __user } = req

  // Fetch the user with id
  const existingUser = await App.Models.User.findById(__user._id).select(
    '+password'
  )
  if (!existingUser) {
    return res.unauthorized()
  }

  if (!(await bcrypt.compare(oldPassword, existingUser.password))) {
    return res.forbidden({
      message: App.Messages.MeUpdatePassword.Error.IncorrectOldPassword(),
    })
  }

  // Save New Password
  existingUser.password = newPassword
  await existingUser.save()

  // TODO - Send Email-Notification for password update

  // All Done
  return res.success({
    message: App.Messages.MeUpdatePassword.Success.UpdateSuccessful(),
  })
}
