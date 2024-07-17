import '@core/declarations'
import requestValidator from '@helpers/request-validator.helper'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import AuthAfterEffectsHelper from '@helpers/auth-after-effects.helper'
import { SignInWithPasswordGrantDTO } from '../dtos/signin.dto'

export default async function _Signin(req: Request, res: Response) {
  const errors = await requestValidator(SignInWithPasswordGrantDTO, req.body)
  if (errors) {
    return res.unprocessableEntity({ errors })
  }
  const { email, phone, countryCode, password, sessionIdentifier } = req.body

  // Fetch the user with email id
  let existingUser = null
  if (email) {
    existingUser = await App.Models.User.findByEmail(email).select(
      '+verification +password +parsedFullName'
    )
  }

  // Fetch the user with mobile
  else if (phone) {
    existingUser = await App.Models.User.findByPhone(phone, countryCode).select(
      '+verification +password +parsedFullName'
    )
  }

  if (!existingUser) {
    return res.unauthorized({
      message: App.Messages.Signin.Error.UserNotExists(),
    })
  }

  // Check if user is blocked by admin
  if (existingUser.accountMetadata.isBlockedByAdmin) {
    return res.unauthorized({
      message:
        existingUser.accountMetadata.customBlockMessage ||
        App.Messages.GeneralError.AccountBlockedByAdmin(),
    })
  }

  // Check if the password is correct
  if (!(await bcrypt.compare(password, existingUser.password))) {
    return res.unauthorized({
      message: App.Messages.Signin.Error.IncorrectPassword(),
    })
  }

  existingUser.invalidSigninAttemptsAt = [] // clear invalid attempts if success
  await existingUser.save()

  if (existingUser.twoFactorAuthentication.isActivated) {
    const { _id } = existingUser
    const { authenticationType } = existingUser.twoFactorAuthentication
    return res.success({
      message: App.Messages.Signin.Success.SigninSuccessfulProceedFor2FA(),
      item: { _user: _id, twoFactorAuthentication: authenticationType },
    })
  }

  const { token, loginSessions } = await AuthAfterEffectsHelper.GenerateToken({
    sessionIdentifier,
    _user: existingUser._id.toString(),
  })

  // Issue JWT to the user
  return res.success({
    message: App.Messages.Signin.Success.SigninSuccessful(),
    item: {
      isFirstTimeLogin: existingUser.accountMetadata.isFirstTimeLogin,
      token,
      sessionIdentifier: loginSessions.current.sessionIdentifier,
    },
  })
}
