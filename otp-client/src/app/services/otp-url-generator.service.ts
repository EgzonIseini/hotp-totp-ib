import {Injectable} from '@angular/core';
import {OtpType} from "../interfaces/otp-type.enum";

@Injectable({
  providedIn: 'root'
})
export class OtpUrlGeneratorService {

  constructor() {
  }

  private generateHotpUrl = (counter: number = 0): string => `&counter=${counter}`;

  private generateTotpUrl = (period: number = 30): string => `&period=${period}`;

  generateOtpUrl(
    otpType: OtpType,
    username: string | undefined,
    secret: string | undefined,
    algorithm: string = 'SHA1',
    digits: number = 6): string | undefined {

    if (!username || !secret) {
      return undefined
    }

    const baseUrl = `otpauth://${otpType.toLowerCase()}/OTPIB:${username}@finki.ukim.mk?secret=${secret}&issuer=EgzonIseini&algorithm=${algorithm}&digits=${digits}`;

    let otpUrl: string
    console.log('otpType.valueOf() : ', otpType.valueOf())
    console.log('OtpType.HOTP.valueOf() : ', OtpType.HOTP.valueOf())
    if (otpType.valueOf() == OtpType.HOTP.valueOf()) {
      otpUrl = baseUrl + this.generateHotpUrl()
    } else {
      otpUrl = baseUrl + this.generateTotpUrl()
    }

    return encodeURI(otpUrl)
  }
}
