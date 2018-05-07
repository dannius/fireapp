import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountRoutes } from '@app/account/account.routing';
import { InfoUpdateComponent, PasswordResetComponent, ProfileSettingsComponent } from '@app/account/profile-settings';
import { UserService } from '@app/account/user.service';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    ProfileSettingsComponent,
    InfoUpdateComponent,
    PasswordResetComponent,
  ],
  imports: [
    RouterModule.forChild(AccountRoutes),
    SharedModule
  ],
  exports: [
    ProfileSettingsComponent,
    InfoUpdateComponent,
    PasswordResetComponent,
  ],
  providers: [
    UserService,
  ]
})
export class AccountModule { }
