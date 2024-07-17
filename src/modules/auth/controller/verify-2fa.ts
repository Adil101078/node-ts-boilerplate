import '@core/declarations'
import { Request, Response } from 'express'
import AuthenticatorHelper from '@helpers/authenticator.helper'
import Dayjs from 'dayjs'

export default async function _Verify2Fa(req: Request, res: Response) {
  const _user = req.user
  const { otp } = req.body

  let responseMessage: string
  let responsePayload: { [key: string]: string }

  // Check 2FA If Already Turned On
  if (_user?.twoFactorAuthentication?.isActivated)
    return res.forbidden({
      message: App.Messages.MeUpdateSettings.Error.SettingAlreadySet({
        setting: 'Security',
        givenValueInRequest: '2FA',
      }),
    })

  // Verify And Turn ON 2FA
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

  _user.twoFactorAuthentication.isActivated = true
  _user.twoFactorAuthentication.authenticatorSecretVerifiedAt = Dayjs().toDate()
  // Save Data
  await _user.save()

  return res.success({
    message:
      responseMessage ??
      App.Messages.MeUpdateSettings.Success.UpdateSuccessful(),
    item: responsePayload,
  })
}
