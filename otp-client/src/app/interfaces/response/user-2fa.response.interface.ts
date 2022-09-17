import {OtpType} from "../otp-type.enum";

export interface User2FAResponse {
  userId: number;
  otpEnabled: boolean;
  otpType: OtpType;
  secret?: string;
  username?: string;
}
