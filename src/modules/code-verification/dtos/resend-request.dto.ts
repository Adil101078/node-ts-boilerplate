import '@core/declarations'
import { IsMongoId } from 'class-validator'

export default class ResendRequestDTO {
  @IsMongoId()
  _codeVerification: string
}
