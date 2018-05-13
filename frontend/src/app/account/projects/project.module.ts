import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectItemComponent } from '@app/account/projects/item/item.component';
import { ProjectListComponent } from '@app/account/projects/list/list.component';
import { ProjectListResolver } from '@app/account/projects/list/list.resolver';
import { ManagementComponent } from '@app/account/projects/management/management.component';
import { ProjectInfoComponent } from '@app/account/projects/management/project-info/project-info.component';
import { ProjectSettingsComponent } from '@app/account/projects/management/project-settings/project-settings.component';
import { ProjectUpdateComponent } from '@app/account/projects/management/project-update/project-update.component';
import { ProjectRoutes } from '@app/account/projects/project.routing';
import { ProjectService } from '@app/account/projects/project.service';
import { ProjectShowComponent } from '@app/account/projects/show/show.component';
import { ProjectShowResolver } from '@app/account/projects/show/show.resolver';
import { UserService } from '@app/account/user.service';
import { SharedModule } from '@app/shared';
import { ManagementResolver } from '@app/account/projects/management/management.resolver';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectItemComponent,
    ProjectShowComponent,
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
    ProjectShowComponent,
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
    ProjectShowResolver,
    ManagementResolver
  ]
})
export class ProjectModule { }
