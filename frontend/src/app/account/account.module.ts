import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountRoutes } from '@app/account/account.routing';
import { InfoUpdateComponent, PasswordResetComponent, ProfileSettingsComponent } from '@app/account/profile-settings';
import { UserService } from '@app/account/user.service';
import { SharedModule } from '@app/shared';
import { UserListComponent } from '@app/account/user-list/user-list.component';
import { BindingService } from '@app/account/user-list/binding.service';

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
    BindingService
  ]
})
export class AccountModule { }
