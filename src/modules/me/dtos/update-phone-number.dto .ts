import '@core/declarations'
import { IsMongoId } from 'class-validator'

export default class UpdatePhoneNumberdDTO {
  @IsMongoId()
  _codeVerification: string
}
