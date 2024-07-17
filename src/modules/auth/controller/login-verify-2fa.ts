import '@core/declarations'
import { Request, Response } from 'express'
import AuthenticatorHelper from '@helpers/authenticator.helper'
import authAfterEffectsHelper from '@helpers/auth-after-effects.helper'

export default async function _LoginVerify2Fa(req: Request, res: Response) {
  const { otp, _userId, sessionIdentifier } = req.body

  // Check User Exists
  const _user = await App.Models.User.findById(_userId)
    .lean()
    .select('+parsedFullName')
  if (!_user) {
    return res.notFound({ message: App.Messages.Signin.Error.UserNotExists() })
  }
  // Check if 2FA is Turned On
  if (!_user.twoFactorAuthentication.isActivated)
    return res.forbidden({
      message:
        App.Messages.MeUpdateSettings.Error.RequiredDetailFor2FANotAvailable({
          details: '2FA',
        }),
    })

  // Verify 2FA
  const isVerified = AuthenticatorHelper.Verify({
    secret: _user.twoFactorAuthentication.authenticatorSecret,
    token: otp,
  })
  if (!isVerified) {
    return res.forbidden({
      message:
        App.Messages.MeUpdateSettings.Error.AuthenticatorAppOtpVerificationFailed(),
    })
  }

  // Create auth token for the user
  const { token, loginSessions } = await authAfterEffectsHelper.GenerateToken({
    sessionIdentifier,
    _user: _user._id.toString(),
  })

  return res.success({
    message: App.Messages.Signin.Success.SigninSuccessful(),

    item: {
      isFirstLogin: _user.isFirstLogin,
      token,
      hasUsername: _.isString(_user?.parsedFullName),
      sessionIdentifier: loginSessions.current.sessionIdentifier,
    },
  })
}
