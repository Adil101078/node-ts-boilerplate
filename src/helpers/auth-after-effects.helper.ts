import '@core/declarations'
import { GenerateNewLoginSession } from '@core/utils'
import JWTHelper from '@helpers/jwt.helper'

export class AuthAfterEffectsHelper {
  async GenerateToken(payload: { [key: string]: any }) {
    const {
      ip,
      _user,
      email,
      phone,
      device,
      countryCode,
      plateFormName,
      deviceByAutoDetection,
      sessionIdentifier = '',
    } = payload

    const existingUser = await App.Models.User.findOne(
      _.omitBy({ _id: _user, email, phone, countryCode }, _.isNil)
    )

    const loginSessions = await GenerateNewLoginSession({
      ip,
      device,
      sessionIdentifier,
      deviceByAutoDetection,
      existingLoginSessions: existingUser.loginSessions.toObject(),
    })

    existingUser.loginSessions = loginSessions.all

    // Generate a new JWT token
    const token = JWTHelper.GenerateToken({
      _id: existingUser._id.toString(),
      sessionIdentifier: loginSessions.current.sessionIdentifier,
    })

    existingUser.lastSigninIp = ip
    existingUser.lastSigninAt = Date.now()

    // Remove twoFactorAuthentication code if exists
    if (existingUser.twoFactorAuthentication.code) {
      existingUser.twoFactorAuthentication.code = undefined
      existingUser.twoFactorAuthentication.expiresAt = undefined
    }

    // Add Platform Metadata
    if (plateFormName) {
      const platFormBasedLoginCount = existingUser.platFormBasedLoginCount
        ? { ...existingUser.platFormBasedLoginCount }
        : {}

      platFormBasedLoginCount[plateFormName] = platFormBasedLoginCount[
        plateFormName
      ]
        ? ++platFormBasedLoginCount[plateFormName]
        : 1

      existingUser.platFormBasedLoginCount = platFormBasedLoginCount
    }

    await existingUser.save()

    return {
      token,
      loginSessions,
    }
  }
}

// All Done
export default new AuthAfterEffectsHelper()
