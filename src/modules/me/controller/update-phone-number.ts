import '@core/declarations'
import requestValidator from '@helpers/request-validator.helper'
import { Request, Response } from 'express'
import {
  CodeVerificationPurpose,
  CodeVerificationStatus,
} from '@models/code-verification'
import { UpdatePhoneNumberdDTO } from '../dtos/update-phone-number.dto '

export default async function _UpdatePhoneNumber(req: Request, res: Response) {
  const errors = await requestValidator(UpdatePhoneNumberdDTO, req.params)
  if (errors) {
    return res.unprocessableEntity({ errors })
  }

  const { _codeVerification } = req.params
  const { user: __user } = req

  const codeVerification = await App.Models.CodeVerification.findOne({
    _id: _codeVerification,
    status: CodeVerificationStatus.Passed,
    purpose: CodeVerificationPurpose.USER_PHONE_UPDATE,
    isActive: true,
  }).sort({ createdAt: -1 })

  if (!codeVerification) {
    return res.badRequest({
      message: App.Messages.Signup.Error.PreSignCodeVerificationFailed(),
    })
  }

  // Fetch the user with id
  const existingUser = await App.Models.User.findById(__user._id)
  if (!existingUser) {
    return res.unauthorized()
  }

  // Save New Password
  existingUser.countryCode = codeVerification.countryCode
  existingUser.phone = codeVerification.phone

  await existingUser.save()

  // All Done
  return res.success({
    message: App.Messages.MeUpdatePhoneNumber.Success.UpdateSuccessful(),
  })
}
