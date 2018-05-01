import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountRoutes } from '@app/account/account.routing';
import { InfoUpdateComponent, PasswordResetComponent, ProfileSettingsComponent } from '@app/account/profile-settings';
import { ProjectListComponent } from '@app/account/projects/list/list.component';
import { UserService } from '@app/account/user.service';
import { SharedModule } from '@app/shared';
import { SearchFormComponent } from '@app/shared';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProfileSettingsComponent,
    InfoUpdateComponent,
    PasswordResetComponent,
    SearchFormComponent
  ],
  imports: [
    RouterModule.forChild(AccountRoutes),
    SharedModule,
    RouterModule,
  ],
  exports: [
    ProjectListComponent,
    ProfileSettingsComponent,
    InfoUpdateComponent,
    PasswordResetComponent,
    SearchFormComponent
  ],
  providers: [
    UserService
  ]
})
export class AccountModule { }
