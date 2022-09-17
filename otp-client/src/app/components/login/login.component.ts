import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {User} from "../../interfaces/user.class";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  loginForm = this.formBuilder.group({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  twoFaForm = this.formBuilder.group({
    otp: new FormControl('', [Validators.required])
  })

  errorMessage: string | undefined = undefined;
  twoFaErrorMessage: string | undefined = undefined;

  isLoggedIn = false;
  is2FaCompleted = false;

  constructor(private readonly authService: AuthService,
              private readonly formBuilder: FormBuilder,
              private readonly router: Router) {
  }

  ngOnInit(): void {
  }

  submitLoginForm() {
    console.log('Submitted login form with form ', this.loginForm.value);

    return this.authService.loginUser(
      this.loginForm.value.username!,
      this.loginForm.value.password!,
    )
      .subscribe({
        next: (user: User) => {
          this.errorMessage = undefined;
          this.isLoggedIn = !!user;
          this.is2FaCompleted = user.twoFactorPassed;

          if (this.is2FaCompleted) {
            this.router.navigate([''])
          }
        },
        error: (err) => {
          this.errorMessage = err.message;
        },
      });
  }

  submitTwoFaForm() {
    console.log('submitTwoFaForm ')
    this.authService.verify2FA(this.twoFaForm.value.otp!)
      .subscribe({
        next: () => {
          this.is2FaCompleted = true
          this.isLoggedIn = true
          this.errorMessage = undefined
          this.twoFaErrorMessage = undefined
          this.router.navigate([''])
        },
        error: () => {
          this.twoFaErrorMessage = 'There was an error authenticating with the given OTP.'
        }
      })
  }
}
