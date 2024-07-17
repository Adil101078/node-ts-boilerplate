import '@core/declarations'
import * as qrcode from 'qrcode'
import { authenticator } from 'otplib'

class AuthenticatorHelper {
  GenerateSecret() {
    try {
      const secret = authenticator.generateSecret()
      return secret
    } catch (error) {
      Logger.error(error)
    }
  }

  GenerateOtpAuthURI(payload: { accountName: string; secret: string }) {
    try {
      const { accountName, secret } = payload
      const issuer = App.Config.AWS.BRAND_NAME

      const otpAuthURI = authenticator.keyuri(accountName, issuer, secret)

      return otpAuthURI
    } catch (error) {
      Logger.error(error)
    }
  }

  async GenerateQrCode(payload: { accountName: string; secret: string }) {
    try {
      const { accountName, secret } = payload

      const otpAuthURI = this.GenerateOtpAuthURI({ accountName, secret })
      const qrCode: string = await qrcode.toDataURL(otpAuthURI)

      return qrCode
    } catch (error) {
      Logger.error(error)
    }
  }

  Verify(payload: { secret: string; token: string }) {
    try {
      const { secret, token } = payload
      const isVerified = authenticator.verify({
        token,
        secret,
      })

      return isVerified
    } catch (error) {
      Logger.error(error)
    }
  }
}

export default new AuthenticatorHelper()
