import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountRoutes } from '@app/account/account.routing';
import { EventListComponent } from '@app/account/event/event-list/event-list.component';
import { InfoUpdateComponent, PasswordResetComponent, ProfileSettingsComponent } from '@app/account/profile-settings';
import { UserService } from '@app/account/user.service';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    EventListComponent,
    ProfileSettingsComponent,
    InfoUpdateComponent,
    PasswordResetComponent
  ],
  imports: [
    RouterModule.forChild(AccountRoutes),
    SharedModule,
    RouterModule,
  ],
  exports: [
    EventListComponent,
    ProfileSettingsComponent,
    InfoUpdateComponent,
    PasswordResetComponent
  ],
  providers: [
    UserService
  ]
})
export class AccountModule { }
