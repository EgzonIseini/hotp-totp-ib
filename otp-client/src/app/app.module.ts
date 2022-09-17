import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgxNavbarModule} from 'ngx-bootstrap-navbar';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AlertModule} from 'ngx-bootstrap/alert';
import {UserSettingsComponent} from './components/user-settings/user-settings.component';
import {ButtonsModule} from "ngx-bootstrap/buttons";
import { OnOffPipe } from './OnOff.pipe';
import {QRCodeModule} from "angularx-qrcode";
import { UserTwoFactorAuthComponent } from './components/user-two-factor-auth/user-two-factor-auth.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UserSettingsComponent,
    OnOffPipe,
    UserTwoFactorAuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxNavbarModule,
    ReactiveFormsModule,
    HttpClientModule,
    AlertModule,
    FormsModule,
    ButtonsModule,
    QRCodeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
