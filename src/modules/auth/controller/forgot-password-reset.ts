import '@core/declarations'
import JWTHelper from '@helpers/jwt.helper'
import requestValidator from '@helpers/request-validator.helper'
import {
  CodeVerificationPurpose,
  CodeVerificationStatus,
} from '@models/code-verification'
import { Request, Response } from 'express'
import Dayjs from 'dayjs'
import {ForgotPasswordResetDTO} from '../dtos/forgot-password-reset.dto'

export default async function ForgotPasswordReset(req: Request, res: Response) {
  const errors = await requestValidator(ForgotPasswordResetDTO, req.body)
  if (errors) {
    return res.unprocessableEntity({ errors })
  }

  const { _codeVerification, password } = req.body

  // Fetch the code Verification
  const existingCodeVerification = await App.Models.CodeVerification.findOne({
    _id: _codeVerification,
    status: CodeVerificationStatus.Passed,
    purpose: CodeVerificationPurpose.FORGOT_PASSWORD,
    isActive: true,
  })
    .select('+verificationLinkToken')
    .sort({ _id: -1 })

  if (!existingCodeVerification) {
    return res.unauthorized()
  }

  const { email, phone } = existingCodeVerification
  let existingUser = null

  if (email) {
    // Fetch the user with email id
    existingUser = await App.Models.User.findByEmail(email).select(
      '+verification +socialId'
    )
  } else if (phone) {
    // Fetch the user with email id
    existingUser = await App.Models.User.findByPhone(phone).select(
      '+verification +socialId'
    )
  } else {
    return res.badRequest({
      message: App.Messages.GeneralError.BadRequest(),
    })
  }

  if (!existingUser) {
    return res.unauthorized()
  }

  // get expiration config
  const {
    EXPIRATION_TIME_FOR_PASSED_CODE,
    EXPIRATION_TIME_FOR_PASSED_CODE_UNIT,
  } = App.Config.CODE_VERIFICATION

  // check expiry time for passed code verification
  if (
    Dayjs(existingCodeVerification.verificationPerformedAt).isBefore(
      Dayjs().subtract(
        EXPIRATION_TIME_FOR_PASSED_CODE,
        EXPIRATION_TIME_FOR_PASSED_CODE_UNIT
      )
    )
  ) {
    existingCodeVerification.isActive = false
    await existingCodeVerification.save()
    return res.unauthorized({
      message: App.Messages.CodeVerification.Error.SessionExpired(),
    })
  }

  // Set New Password
  existingUser.password = password

  const isFirstLogin = existingUser.isFirstLogin
  existingUser.isFirstLogin = false
  await existingUser.save()
  existingCodeVerification.isActive = false
  await existingCodeVerification.save()

  // TODO - Send Email for reset password success

  // Generate a new JWT token
  const token = JWTHelper.GenerateToken({
    _id: existingUser._id.toString(),
  })

  // All Done
  return res.success({
    message: App.Messages.ForgotPassword.Success.ResetSuccessful(),
    isFirstLogin,
    token,
  })
}
