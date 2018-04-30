import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountRoutes } from '@app/account/account.routing';
import { EventListComponent } from '@app/account/event/event-list/event-list.component';
import { ProfileSettingsComponent } from '@app/account/profile-settings/profile-settings.component';
import { UserService } from '@app/account/user.service';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    EventListComponent,
    ProfileSettingsComponent
  ],
  imports: [
    RouterModule.forChild(AccountRoutes),
    SharedModule,
    RouterModule,
  ],
  exports: [
    EventListComponent
  ],
  providers: [
    UserService
  ]
})
export class AccountModule { }
