import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, filter, map, Observable, of, switchMap, tap, zip} from 'rxjs';
import {UserResponse} from '../interfaces/response/user.response.interface';
import {UserLoginRequest} from '../interfaces/request/user-login.request.interface';
import {User} from '../interfaces/user.class';
import {User2FAResponse} from "../interfaces/response/user-2fa.response.interface";
import {OtpType} from "../interfaces/otp-type.enum";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly authenticatedUser = new BehaviorSubject<User | undefined>(undefined);

  constructor(private readonly httpClient: HttpClient) {
  }

  loginUser(username: string, password: string): Observable<User> {
    return this.httpClient.post<UserResponse>(`/auth/login`, <UserLoginRequest>{
      username,
      password,
    })
      .pipe(
        switchMap(userResponse => zip([
          of(userResponse),
          this.get2FAForUserId(userResponse.id)
        ])),
        map(([userResponse, user2FA]) => {
          return new User(
            userResponse.id,
            userResponse.username,
            userResponse.timeCreated,
            userResponse.timeUpdated,
            !user2FA.otpEnabled,
            user2FA.otpType,
            user2FA.otpEnabled,
            user2FA.secret
          )
        }),
        tap(user => this.authenticatedUser.next(user))
      );
  }

  get2FAForUserId(userId: number): Observable<User2FAResponse> {
    return this.httpClient.get<User2FAResponse>(`/auth/2fa/${userId}`)
  }

  toggle2FA(otpType: OtpType, is2FAEnabled: boolean): Observable<{}> {
    return this.httpClient.patch<{}>(`/auth/2fa/${this.authenticatedUser.value?.id}?enabled=${is2FAEnabled}&otpType=${otpType.toString()}`, {
      otpType: OtpType,
      enabled: is2FAEnabled,
    }).pipe(
      map(data => {
        return {
          ...data,
          username: this.authenticatedUser.value?.username
        }
      })
    )
  }

  getAuthenticatedUser = () => this.authenticatedUser.asObservable()
    .pipe(
      tap(() => console.log('Called getAuthenticatedUser()')),
      catchError(err => {
        this.authenticatedUser.next(undefined);
        throw err;
      }),
    );

  logoutUser = () => this.authenticatedUser.next(undefined);

  isUserLoggedIn = (): boolean => !!this.authenticatedUser.value && !!this.authenticatedUser.value?.twoFactorPassed;

  hasUserCompleted2FA = (): boolean => this.authenticatedUser.value?.otpEnabled ? (this.authenticatedUser.value!.twoFactorPassed) : true;

  complete2FA() {
    const user = this.authenticatedUser.value
    if (user) {
      user.twoFactorPassed = true
    }
    this.authenticatedUser.next(
      user
    )
  }

  verify2FA(otp: string) {
    return this.httpClient.post<boolean>('/otp/verify', {
      otp,
      userId: this.authenticatedUser.value?.id
    })
      .pipe(
        filter(() => !!this.authenticatedUser.value),
        tap(isTwoFaVerified => {
          if (isTwoFaVerified) {
            const user = this.authenticatedUser.value
            if (user) {
              user.twoFactorPassed = isTwoFaVerified
              this.authenticatedUser.next(user)
            }
          }
        })
      )
  }

}
