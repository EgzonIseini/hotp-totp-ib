import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title = 'OTP-IB';

  isLoggedIn: boolean = false

  constructor(private readonly authService: AuthService,
              private readonly router: Router) {}

  ngOnInit(): void {
    this.authService.getAuthenticatedUser()
      .subscribe({
        next: user => this.isLoggedIn = !!user && user.twoFactorPassed,
        error: () => this.isLoggedIn = false
      })
  }

  logoutUser() {
    this.authService.logoutUser()
    this.router.navigate(['/login'])
  }
}
