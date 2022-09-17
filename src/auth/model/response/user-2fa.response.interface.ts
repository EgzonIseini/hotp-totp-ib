export interface User2FactorAuthenticationResponse {
  userId: number;
  otpEnabled: boolean;
  otpType: string;
  secret?: string;
}