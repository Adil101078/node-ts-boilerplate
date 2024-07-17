import { IsString } from 'class-validator'

export default class LinkVerificationDTO {
  @IsString()
  token: string
}
