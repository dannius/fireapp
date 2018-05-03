import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountRoutes } from '@app/account/account.routing';
import { InfoUpdateComponent, PasswordResetComponent, ProfileSettingsComponent } from '@app/account/profile-settings';
import { ProjectListComponent } from '@app/account/projects/list/list.component';
import { UserService } from '@app/account/user.service';
import { SharedModule } from '@app/shared';
import { CreateProjectDialogComponent } from '@app/account/projects/create-dialog/dialog.component';
import { ProjectService } from '@app/account/projects/project.service';
import { ProjectListResolver } from '@app/account/projects/list/list.resolver';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProfileSettingsComponent,
    InfoUpdateComponent,
    PasswordResetComponent,
    CreateProjectDialogComponent
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
    CreateProjectDialogComponent
  ],
  providers: [
    UserService,
    ProjectService,
    ProjectListResolver
  ],
  entryComponents: [
    CreateProjectDialogComponent
  ]
})
export class AccountModule { }
