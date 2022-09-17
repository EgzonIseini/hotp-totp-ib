export interface GenerateOtpResponse {
  otpType: string;
  window: number;
  id: string;
  secret: string;
}