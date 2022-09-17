import {OtpType} from "./otp-type.enum";

export class User {
  constructor(public id: number,
              public username: string,
              public timeCreated: Date,
              public timeUpdated: Date,
              public twoFactorPassed: boolean,
              public otpType: OtpType,
              public otpEnabled: boolean,
              public secret?: string) {
  }
}
