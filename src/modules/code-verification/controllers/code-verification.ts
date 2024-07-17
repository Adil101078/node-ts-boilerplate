import '@core/declarations'
import _ from 'lodash'
import requestValidator from '@helpers/request-validator.helper'
import { Request, Response } from 'express'
import { CodeVerificationDTO } from '../dtos/code-verification.dto'
import {
  CodeVerificationPurpose,
  CodeVerificationStatus,
} from '@models/code-verification'
import OTPHelper from '@helpers/otp.helper'
import AuthAfterEffectsHelper from '@helpers/auth-after-effects.helper'

export default async function CodeVerification(req: Request, res: Response) {
  const errors = await requestValidator(CodeVerificationDTO, req.body)
  if (errors) {
    return res.unprocessableEntity({ errors })
  }

  const { _codeVerification, code, sessionIdentifier } = req.body

  const payload = _.omitBy(
    {
      code,
    },
    _.isNil
  )

  // Find record
  const existingCodeVerification = await App.Models.CodeVerification.findOne({
    _id: _codeVerification,
    status: {
      $in: [CodeVerificationStatus.Pending, CodeVerificationStatus.Failed],
    },
    isActive: true,
    verificationLinkToken: { $exists: false },
  })
    .select('+internalOTP')
    .sort({ _id: -1 })

  if (!existingCodeVerification) {
    return res.badRequest({
      message: App.Messages.CodeVerification.Error.MissingRecordToVerify(),
    })
  }

  payload.existingCodeVerification = existingCodeVerification.toObject()

  // Verify OTP using OTPHelper
  if (existingCodeVerification.email) {
    payload.constructedKey = existingCodeVerification.email
  } else if (
    existingCodeVerification.phone &&
    existingCodeVerification.countryCode
  ) {
    payload.constructedKey = `+${existingCodeVerification.countryCode}${existingCodeVerification.phone}`
  } else {
    throw Error(App.Messages.GeneralError.SomethingWentWrong())
  }

  const verifyCodeResponse: any = await OTPHelper.VerifyCode(
    payload,
    payload.code
  )

  const isCodeVerified = verifyCodeResponse.VerificationResponse.Valid ?? false

  if (isCodeVerified) {
    // Verified
    if (
      existingCodeVerification.purpose === CodeVerificationPurpose.SIGNIN_2FA
    ) {
      existingCodeVerification.isActive = false
    }
    existingCodeVerification.status = CodeVerificationStatus.Passed
    existingCodeVerification.verificationPerformedAt = Date.now()
    await existingCodeVerification.save()

    // All Done
    const existingCodeVerificationJSON = existingCodeVerification.toObject()
    delete existingCodeVerificationJSON.internalOTP

    // if purpose is SIGNIN_2FA send jwt token
    if (
      existingCodeVerification.purpose === CodeVerificationPurpose.SIGNIN_2FA
    ) {
      const { token, loginSessions } =
        await AuthAfterEffectsHelper.GenerateToken({
          _user: existingCodeVerification._user,
          sessionIdentifier,
        })

      // Issue JWT to the user
      return res.success({
        message: App.Messages.Signin.Success.SigninSuccessful(),
        item: {
          sessionIdentifier: loginSessions.current.sessionIdentifier,
          token,
        },
      })
    }
    return res.success({
      message: App.Messages.CodeVerification.Success.CodeVerified(),
      item: {
        codeVerification: existingCodeVerificationJSON,
      },
    })
  } else {
    // Not Verified
    existingCodeVerification.status = CodeVerificationStatus.Failed
    existingCodeVerification.verificationPerformedAt = Date.now()
    existingCodeVerification.internalOTP.usedRetryAttempt++
    await existingCodeVerification.save()

    // All Done
    const existingCodeVerificationJSON = existingCodeVerification.toObject()
    delete existingCodeVerificationJSON.internalOTP
    return res.badRequest({
      message: App.Messages.CodeVerification.Error.CodeVerificationFailed(),
      item: {
        codeVerification: existingCodeVerificationJSON,
      },
    })
  }
}
