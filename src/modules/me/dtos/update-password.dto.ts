import '@core/declarations'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export default class ResetPasswordDTO {
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!])[A-Za-z\d@!]+$/, {
    message: App.Messages.ClassValidatorMessages.InvalidPassword(),
  })
  oldPassword: string

  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@!])[A-Za-z\d@!]+$/, {
    message: App.Messages.ClassValidatorMessages.InvalidPassword(),
  })
  newPassword: string
}
