import {
  IsString,
  IsOptional,
  IsMongoId,
  MinLength,
  MaxLength,
  Matches,
  IsArray,
  IsDateString,
} from 'class-validator'

export default class UpdateDTO {
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  @Matches(/^[a-z\d_.]+$/, {
    message: App.Messages.ClassValidatorMessages.InvalidUsername(),
  })
  username: string

  @IsString()
  @IsOptional()
  firstName: string

  @IsString()
  @IsOptional()
  middleName: string

  @IsString()
  @IsOptional()
  lastName: string

  @IsMongoId()
  @IsOptional()
  _codeVerification: string

  @IsString()
  @IsOptional()
  bio: string

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  links: string

  @IsDateString()
  @IsOptional()
  dateOfBirth: Date
}
