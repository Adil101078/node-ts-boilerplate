import '@core/declarations'
import { Request, Response } from 'express'
import AuthenticatorHelper from '@helpers/authenticator.helper'

export default async function _SecurityUpdateRequest2Fa(
  req: Request,
  res: Response
) {
  const _user = req.user

  let responseMessage: string
  let responsePayload: { [key: string]: string }

  // Turn OFF 2FA
  if (_user.twoFactorAuthentication.isActivated) {
    _user.twoFactorAuthentication.isActivated = false
    responseMessage =
      App.Messages.MeUpdateSettings.Success.AuthenticationTurnedOffSuccessfully()
  } else {
    const secret = AuthenticatorHelper.GenerateSecret()
    _user.twoFactorAuthentication = {
      isActivated: false,
      authenticationType: 'AuthenticatorApp',
      authenticatorSecret: secret,
    }
    responseMessage =
      App.Messages.MeUpdateSettings.Success.AuthenticatorSecretGeneratedSuccessfully()

    const username = `${_user.firstName} ${_user.lastName}`

    const otpAuthURI = AuthenticatorHelper.GenerateOtpAuthURI({
      accountName: username,
      secret,
    })
    const qrCode = await AuthenticatorHelper.GenerateQrCode({
      accountName: username,
      secret,
    })
    responsePayload = { otpAuthURI, qrCode }
  }

  // Save Data
  await _user.save()

  return res.success({
    message: responseMessage,
    item: responsePayload,
  })
}
