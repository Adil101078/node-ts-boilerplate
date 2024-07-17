// import '@core/declarations'
// import requestValidator from '@helpers/request-validator.helper'
// import {
//   CodeVerificationPurpose,
//   CodeVerificationStatus,
// } from '@models/code-verification'
// import { Request, Response } from 'express'
// import Dayjs from 'dayjs'
// import UpdateDTO from '../dtos/update.dto'

// export default async function UpdateUser(req: Request, res: Response) {
//   const errors = await requestValidator(UpdateDTO, req.body)
//   if (errors) {
//     return res.unprocessableEntity({ errors })
//   }

//   const { user: __user } = req

//   const {
//     username: _username,
//     firstName,
//     middleName,
//     lastName,
//     bio,
//     links,
//     media,
//     dateOfBirth,
//     gender,
//     _codeVerification,
//   } = req.body

//   let phone = null
//   let countryCode = null
//   let existingCodeVerification = null

//   const existingUser = await App.Models.User.findById(__user._id)

//   if (_codeVerification) {
//     // Fetch the code Verification
//     existingCodeVerification = await App.Models.CodeVerification.findOne({
//       _id: _codeVerification,
//       status: CodeVerificationStatus.Passed,
//       purpose: {
//         $in: [CodeVerificationPurpose.USER_PHONE_UPDATE],
//       },
//       isActive: true,
//     }).sort({ _id: -1 })

//     if (!existingCodeVerification) {
//       return res.badRequest({
//         message: App.Messages.CodeVerification.Error.MissingRecordToVerify(),
//       })
//     }

//     // get expiration config
//     const {
//       EXPIRATION_TIME_FOR_PASSED_CODE,
//       EXPIRATION_TIME_FOR_PASSED_CODE_UNIT,
//     } = App.Config.CODE_VERIFICATION

//     // check expiry time for passed code verification
//     if (
//       Dayjs(existingCodeVerification.verificationPerformedAt).isBefore(
//         Dayjs().subtract(
//           EXPIRATION_TIME_FOR_PASSED_CODE,
//           EXPIRATION_TIME_FOR_PASSED_CODE_UNIT
//         )
//       )
//     ) {
//       existingCodeVerification.isActive = false
//       await existingCodeVerification.save()
//       return res.forbidden({
//         message: App.Messages.CodeVerification.Error.SessionExpired(),
//       })
//     }

//     // Update 2FA email/phone if same as personal info email/phone
//     if (
//       existingCodeVerification.purpose ===
//       CodeVerificationPurpose.USER_PHONE_UPDATE
//     ) {
//       phone = existingCodeVerification.phone
//       countryCode = existingCodeVerification.countryCode
//       if (
//         existingUser.twoFactorAuthentication.isActivated &&
//         existingUser.twoFactorAuthentication.phone == existingUser.phone &&
//         existingUser.twoFactorAuthentication.countryCode ==
//           existingUser.countryCode
//       ) {
//         existingUser.twoFactorAuthentication.phone = phone
//         existingUser.twoFactorAuthentication.countryCode = countryCode
//         existingUser.twoFactorAuthentication.phoneVerifiedAt = Dayjs().toDate()
//       }
//     }

//     if (existingUser.socialId && email) {
//       return res.forbidden({
//         message:
//           App.Messages.CodeVerification.Error.UserEmailUpdateInSocialAccountNotAllowed(),
//       })
//     }
//   }

//   let existingUserCount
//   // Check if { Username } is available
//   if (username) {
//     existingUserCount = await App.Models.User.countDocuments({
//       username,
//       isActive: true,
//     })
//     if (existingUserCount) {
//       return res.conflict({
//         message: App.Messages.MeUpdate.Error.UsernameAlreadyInUse(),
//       })
//     }
//   }

//   // Check if { Email } is available
//   if (email) {
//     existingUserCount = await App.Models.User.countDocuments({
//       email,
//       isActive: true,
//     })
//     if (existingUserCount) {
//       return res.conflict({
//         message: App.Messages.MeUpdate.Error.EmailAlreadyInUse(),
//       })
//     }
//   }

//   // Check if { Phone } is available
//   if (phone && countryCode) {
//     existingUserCount = await App.Models.User.countDocuments({
//       phone,
//       countryCode,
//       isActive: true,
//     })
//     if (existingUserCount) {
//       return res.conflict({
//         message: App.Messages.MeUpdate.Error.PhoneAlreadyInUse(),
//       })
//     }
//   }

//   existingUser.username = username ?? existingUser.username
//   existingUser.firstName = firstName ?? existingUser.firstName
//   existingUser.middleName = middleName ?? existingUser.middleName
//   existingUser.lastName = lastName ?? existingUser.lastName
//   existingUser.bio = bio ?? existingUser.bio
//   existingUser.links = links ?? existingUser.links
//   existingUser.media = media ?? existingUser.media
//   existingUser.dateOfBirth = dateOfBirth ?? existingUser.dateOfBirth
//   existingUser.gender = gender ?? existingUser.gender
//   existingUser.email = email ?? existingUser.email
//   existingUser.phone = phone ?? existingUser.phone
//   existingUser.countryCode = countryCode ?? existingUser.countryCode
//   existingUser._updatedBy = existingUser._id

//   await existingUser.save()
//   if (existingCodeVerification) {
//     existingCodeVerification.isActive = false
//     await existingCodeVerification.save()
//   }

//   // All Done
//   return res.success({
//     message: App.Messages.MeUpdate.Success.MeUpdateSuccessful(),
//     item: existingUser,
//   })
// }
