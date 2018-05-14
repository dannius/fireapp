import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnvironmentShowComponent } from '@app/account/projects/environment/show/show.component';
import { EnvironmentResolver } from '@app/account/projects/environment/show/show.resolver';
import { ProjectItemComponent } from '@app/account/projects/item/item.component';
import { ProjectListComponent } from '@app/account/projects/list/list.component';
import { ProjectListResolver } from '@app/account/projects/list/list.resolver';
import { ManagementComponent } from '@app/account/projects/management/management.component';
import { ManagementResolver } from '@app/account/projects/management/management.resolver';
import { ProjectInfoComponent } from '@app/account/projects/management/project-info/project-info.component';
import { ProjectSettingsComponent } from '@app/account/projects/management/project-settings/project-settings.component';
import { ProjectUpdateComponent } from '@app/account/projects/management/project-update/project-update.component';
import { ProjectRoutes } from '@app/account/projects/project.routing';
import { ProjectService } from '@app/account/projects/project.service';
import { UserService } from '@app/account/user.service';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectItemComponent,
    EnvironmentShowComponent,
    ManagementComponent,
    ProjectInfoComponent,
    ProjectSettingsComponent,
    ProjectUpdateComponent,
],
  imports: [
    RouterModule.forChild(ProjectRoutes),
    SharedModule,
    RouterModule,
  ],
  exports: [
    ProjectListComponent,
    ProjectItemComponent,
    EnvironmentShowComponent,
    ManagementComponent,
    ProjectInfoComponent,
    ProjectSettingsComponent,
    ProjectUpdateComponent,
  ],
  providers: [
    UserService,
    ProjectService,

    /////////////
    // RESOLVERS
    /////////////
    ProjectListResolver,
    EnvironmentResolver,
    ManagementResolver
  ]
})
export class ProjectModule { }
