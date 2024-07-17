import '@core/declarations'
import {
  IsEmail,
  IsIn,
  IsMongoId,
  IsNumberString,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator'
import { CodeVerificationVia } from '@modules/code-verification/controllers/request'
import { CodeVerificationPurpose } from '@models/code-verification'

export class RequestByEmailDTO {
  @IsEmail({}, { message: App.Messages.ClassValidatorMessages.InvalidEmail() })
  email: string
}

export class RequestByPhoneDTO {
  @MinLength(1)
  @MaxLength(3)
  @IsNumberString()
  countryCode: string

  @MinLength(3)
  @MaxLength(15)
  @IsNumberString()
  phone: string
}

export class RequestByEmailOrPhoneDTO {
  @ValidateIf((o) => o.phone === undefined)
  @IsEmail({}, { message: App.Messages.ClassValidatorMessages.InvalidEmail() })
  email: string

  @ValidateIf((o) => o.email === undefined)
  @MinLength(3)
  @MaxLength(15)
  @IsNumberString()
  phone: string

  @ValidateIf((o) => o.phone != undefined)
  @MinLength(1)
  @MaxLength(3)
  @IsNumberString()
  countryCode: string
}

export class RequestByEmailForgotPasswordDTO {
  @ValidateIf((o) => o.phone == undefined)
  @IsEmail({}, { message: App.Messages.ClassValidatorMessages.InvalidEmail() })
  email: string
}

export class RequestForSignin2FADTO {
  @IsMongoId()
  _user: string

  @IsString()
  twoFactorAuthenticationCode: string
}

export class RequestDTO {
  @IsString()
  @IsIn(Object.keys(CodeVerificationVia))
  via: string

  @IsString()
  @IsIn(Object.keys(CodeVerificationPurpose))
  purpose: string
}
