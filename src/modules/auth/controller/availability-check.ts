import '@core/declarations'
import requestValidator from '@helpers/request-validator.helper'
import { Request, Response } from 'express'
import { AvailabilityCheckDTO } from '../dtos/availability-check.dto'

export default async function _AvailabilityCheck(req: Request, res: Response) {
  const errors = await requestValidator(AvailabilityCheckDTO, req.query)
  if (errors) {
    return res.unprocessableEntity({ errors })
  }

  const { email: _email, phone, username, countryCode } = req.query
  const email = typeof _email === 'string' ? _email.toLowerCase() : _email

  const searchField = {
    name: null,
    value: null,
  }
  let existingUserCount = 0
  if (email) {
    searchField.name = 'email'
    searchField.value = email
    existingUserCount = await App.Models.User.countDocuments({
      email,
      isActive: true,
    })
  } else if (phone) {
    searchField.name = 'phone'
    searchField.value = phone
    existingUserCount = await App.Models.User.countDocuments({
      phone,
      countryCode,
      isActive: true,
    })
  } else if (username) {
    searchField.name = 'username'
    searchField.value = username
    existingUserCount = await App.Models.User.countDocuments({
      username,
      isActive: true,
    })
  } else {
    return res.unprocessableEntity()
  }

  // All Done
  return res.success({
    message: 'Availability checked successfully.',
    item: {
      [searchField.name]: searchField.value,
      available: existingUserCount <= 0,
    },
  })
}
