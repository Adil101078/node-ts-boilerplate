import '@core/declarations'
import {
  IsMongoId,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator'

export default class ForgotPasswordResetDTO {
  @IsMongoId()
  _codeVerification: string

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!])[A-Za-z\d@!]+$/, {
    message: App.Messages.ClassValidatorMessages.InvalidPassword(),
  })
  password: string
}
