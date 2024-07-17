import '@core/declarations'
import _ from 'lodash'
import requestValidator from '@helpers/request-validator.helper'
import { Request, Response } from 'express'
import { ResendRequestDTO } from '../dtos/resend-request.dto'

export default async function CodeVerificationResendRequest(
  req: Request,
  res: Response
) {
  const errors = await requestValidator(ResendRequestDTO, req.params)
  if (errors) {
    return res.unprocessableEntity({ errors })
  }

  const { _codeVerification } = req.params

  const payload = _.omitBy(
    {
      _codeVerification,
    },
    _.isNil
  )

  const codeVerification = await App.Models.CodeVerification.findOne({
    ...payload,
    isActive: true,
  })

  codeVerification.internalOTP = {
    code: '123456',
  }

  await codeVerification.save()

  if (!codeVerification) {
    return res.notFound({
      message:
        App.Messages.CodeVerificationResend.Error.CodeVerificationNotFound(),
    })
  }

  // All Done
  const codeVerificationJSON = codeVerification.toObject()
  delete codeVerificationJSON.internalOTP
  delete codeVerificationJSON.verificationLinkToken
  return res.success({
    message: App.Messages.CodeVerificationResend.Success.CodeSent({
      type: payload.verificationLinkToken ? 'link' : 'code',
      to: payload.email ? 'email' : 'phone number',
    }),
    item: {
      codeVerification,
    },
  })
}
