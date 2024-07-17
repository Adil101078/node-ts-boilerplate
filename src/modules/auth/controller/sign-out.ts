import '@core/declarations'
import { Request, Response } from 'express'
import requestValidator from '@helpers/request-validator.helper'

export enum SignOutType {
  CURRENT_SESSION = 'CURRENT_SESSION',
  ALL_EXCEPT_CURRENT_SESSION = 'ALL_EXCEPT_CURRENT_SESSION',
  ALL_SESSIONS = 'ALL_SESSIONS',
  SPECIFIC_SESSION = 'SPECIFIC_SESSION',
}

import { SignOutDTO } from '../dtos/signout.dto'

export default async function SignOut(req: Request, res: Response) {
  const errors = await requestValidator(SignOutDTO, req.body)
  if (errors) {
    return res.unprocessableEntity({ errors })
  }

  const { user: __user, userSessionIdentifier } = req
  const { signoutType = SignOutType.CURRENT_SESSION, sessionIdentifier } =
    req.body

  const existingUser = await App.Models.User.findOne({
    _id: __user._id,
    isActive: true,
  })

  if (!existingUser) {
    return res.unauthorized({
      message: App.Messages.SignOut.Error.UserNotExists(),
    })
  }

  let loginSessions = existingUser.loginSessions
  if (signoutType === SignOutType.CURRENT_SESSION) {
    loginSessions = loginSessions.filter(
      (e: { sessionIdentifier: string }) =>
        e.sessionIdentifier != userSessionIdentifier
    )
  } else if (signoutType === SignOutType.ALL_EXCEPT_CURRENT_SESSION) {
    loginSessions = loginSessions.filter(
      (e: { sessionIdentifier: string }) =>
        e.sessionIdentifier == userSessionIdentifier
    )
  } else if (signoutType === SignOutType.SPECIFIC_SESSION) {
    loginSessions = loginSessions.filter(
      (e: { sessionIdentifier: string }) =>
        e.sessionIdentifier != sessionIdentifier
    )
  } else if (signoutType === SignOutType.ALL_SESSIONS) {
    loginSessions = []
  }

  existingUser.loginSessions = loginSessions
  await existingUser.save()

  // All Done
  return res.success({
    message: App.Messages.SignOut.Success.SignOutSuccessful(),
  })
}
