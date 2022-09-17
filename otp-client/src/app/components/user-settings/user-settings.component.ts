import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {User2FAResponse} from "../../interfaces/response/user-2fa.response.interface";
import {OtpUrlGeneratorService} from "../../services/otp-url-generator.service";
import {OtpType} from "../../interfaces/otp-type.enum";
import {FormBuilder, FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  qrCode: string | undefined = undefined;

  multiFactorAuthForm = this.formBuilder.group({
    otpType: new FormControl('', [Validators.required]),
    twoFaEnabled: new FormControl(false, [Validators.required]),
  });

  constructor(private readonly formBuilder: FormBuilder,
              private readonly authService: AuthService,
              private readonly otpUrlGenerator: OtpUrlGeneratorService) {
  }

  ngOnInit(): void {
    this.authService.getAuthenticatedUser()
      .subscribe({
        next: (user) => {
          this.multiFactorAuthForm.patchValue({
            twoFaEnabled: user?.otpEnabled,
            otpType: user?.otpType
          })

          if (user) {
            this.qrCode = this.otpUrlGenerator.generateOtpUrl(user.otpType, user.username, user.secret)

          }
        },
        error: () => {
          this.multiFactorAuthForm.patchValue({
            twoFaEnabled: false,
            otpType: null
          })
        }
      })
  }

  toggled2FA() {

    const multiFaFormValue = this.multiFactorAuthForm.value
    const otpType: OtpType = (multiFaFormValue.otpType?.toLowerCase() ?? 'totp') as OtpType
    const twoFaEnabled: boolean = multiFaFormValue.twoFaEnabled ?? false

    this.authService.toggle2FA(otpType, twoFaEnabled)
      .subscribe({
        next: (res: {}) => {
          if (twoFaEnabled) {
            const data = res as User2FAResponse
            this.qrCode = this.otpUrlGenerator.generateOtpUrl(otpType, data.username, data.secret)
            console.log(this.qrCode)
          }
        },
        error: () => console.log('2FA setting was error')
      })
  }

  isTwoFaEnabled = () => this.multiFactorAuthForm.controls['twoFaEnabled'].value ?? false
}
