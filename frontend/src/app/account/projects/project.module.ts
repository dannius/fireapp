import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectListComponent } from '@app/account/projects/list/list.component';
import { ProjectListResolver } from '@app/account/projects/list/list.resolver';
import { ManagementComponent } from '@app/account/projects/management/management.component';
import { ProjectRoutes } from '@app/account/projects/project.routing';
import { ProjectService } from '@app/account/projects/project.service';
import { ProjectShowComponent } from '@app/account/projects/show/show.component';
import { ProjectShowResolver } from '@app/account/projects/show/show.resolver';
import { UserService } from '@app/account/user.service';
import { SharedModule } from '@app/shared';
import { ProjectItemComponent } from '@app/account/projects/item/item.component';

@NgModule({
  declarations: [
    ProjectListComponent,
    ProjectItemComponent,
    ProjectShowComponent,
    ManagementComponent,
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
    ManagementComponent
  ],
  providers: [
    UserService,
    ProjectService,

    /////////////
    // RESOLVERS
    /////////////
    ProjectListResolver,
    ProjectShowResolver
  ]
})
export class ProjectModule { }
