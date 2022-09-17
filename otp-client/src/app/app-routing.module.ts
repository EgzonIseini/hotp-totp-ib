import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {IsLoggedInGuard} from './is-logged-in.guard';
import {UserSettingsComponent} from "./components/user-settings/user-settings.component";
const routes: Routes = [
  {path: '', component: HomeComponent, canActivate: [IsLoggedInGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'settings', component: UserSettingsComponent, canActivate: [IsLoggedInGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
