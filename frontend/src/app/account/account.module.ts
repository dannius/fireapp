import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountRoutes } from '@app/account/account.routing';
import { InfoUpdateComponent, PasswordResetComponent, ProfileSettingsComponent } from '@app/account/profile-settings';
import { UserService } from '@app/account/user.service';
import { SharedModule } from '@app/shared';
import { UserListComponent } from './user-list/user-list.component';

@NgModule({
  declarations: [
    ProfileSettingsComponent,
    InfoUpdateComponent,
    PasswordResetComponent,
    UserListComponent
],
  imports: [
    RouterModule.forChild(AccountRoutes),
    SharedModule
  ],
  exports: [
    ProfileSettingsComponent,
    InfoUpdateComponent,
    PasswordResetComponent,
    UserListComponent
  ],
  providers: [
    UserService,
  ]
})
export class AccountModule { }
