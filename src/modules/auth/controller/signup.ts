import '@core/declarations'
import requestValidator from '@helpers/request-validator.helper'
import { Request, Response } from 'express'
import { SignUpDTO } from '../dtos/signup.dto'
import {
  CodeVerificationPurpose,
  CodeVerificationStatus,
} from '@models/code-verification'
import Dayjs from 'dayjs'
import AuthAfterEffectsHelper from '@helpers/auth-after-effects.helper'

export default async function _Signup(req: Request, res: Response) {
  const errors = await requestValidator(SignUpDTO, req.body)
  if (errors) {
    return res.unprocessableEntity({ errors })
  }

  const {
    _codeVerification,
    firstName,
    lastName,
    address,
    employmentInfo,
    password,
    country: userResidance,
    dateOfBirth,
    accountType,
    security,
  } = req.body

  let email = req.body?.email
  let phone = req.body?.phone
  let countryCode = req.body?.countryCode

  // Check the Pre-Signup Code Verification

  const codeVerification = await App.Models.CodeVerification.findOne({
    _id: _codeVerification,
    status: CodeVerificationStatus.Passed,
    purpose: CodeVerificationPurpose.PRE_SIGNUP,
    isActive: true,
  }).sort({ createdAt: -1 })

  if (!codeVerification) {
    return res.badRequest({
      message: App.Messages.Signup.Error.PreSignCodeVerificationFailed(),
    })
  }

  // get expiration config
  const {
    EXPIRATION_TIME_FOR_PASSED_CODE,
    EXPIRATION_TIME_FOR_PASSED_CODE_UNIT,
  } = App.Config.CODE_VERIFICATION

  // check expiry time for passed code verification
  if (
    Dayjs(codeVerification.verificationPerformedAt).isBefore(
      Dayjs().subtract(
        EXPIRATION_TIME_FOR_PASSED_CODE,
        EXPIRATION_TIME_FOR_PASSED_CODE_UNIT
      )
    )
  ) {
    codeVerification.isActive = false
    await codeVerification.save()
    return res.unauthorized({
      message: App.Messages.CodeVerification.Error.SessionExpired(),
    })
  }

  if (codeVerification.email) {
    email = codeVerification.email
  } else if (codeVerification.phone && codeVerification.countryCode) {
    phone = codeVerification.phone
    countryCode = codeVerification.countryCode
  } else {
    throw Error(App.Messages.GeneralError.SomethingWentWrong())
  }

  let existingUserCount

  // Check if { Email } is available
  if (email) {
    existingUserCount = await App.Models.User.countDocuments({
      email,
      isActive: true,
    })
    if (existingUserCount) {
      return res.conflict({
        message: App.Messages.Signup.Error.EmailAlreadyInUse(),
      })
    }
  }

  // Check if { Phone } is available
  if (phone) {
    existingUserCount = await App.Models.User.countDocuments({
      phone,
      isActive: true,
    })
    if (existingUserCount) {
      return res.conflict({
        message: App.Messages.Signup.Error.PhoneAlreadyInUse(),
      })
    }
  }

  // Create User Document
  const user = new App.Models.User({
    firstName,
    lastName,
    email,
    phone,
    countryCode,
    address,
    employmentInfo,
    password,
    country: userResidance,
    accountType,
    dateOfBirth,
    security,
    isFirstLogin: false,
  })

  await user.save()
  codeVerification.isActive = false
  await codeVerification.save()

  const { token, loginSessions } = await AuthAfterEffectsHelper.GenerateToken({
    _user: user._id.toString(),
  })

  // All Done
  return res.created({
    message: App.Messages.Signup.Success.SignupSuccessful(),
    isFirstLogin: true,
    token,
    item: {
      isFirstLogin: true,
      token,
      sessionIdentifier: loginSessions.current.sessionIdentifier,
    },
  })
}
