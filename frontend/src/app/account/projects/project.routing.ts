import { Routes } from '@angular/router';
import { ProjectListComponent } from '@app/account/projects/list/list.component';
import { ProjectListResolver } from '@app/account/projects/list/list.resolver';
import { ManagementComponent } from '@app/account/projects/management/management.component';
import { ManagementResolver } from '@app/account/projects/management/management.resolver';
import { EnvironmentShowComponent } from '@app/account/projects/environment/show/show.component';
import { EnvironmentResolver } from '@app/account/projects/environment/show/show.resolver';

export const ProjectRoutes: Routes = [
  {
    path: '',
    component: ProjectListComponent,
    resolve: { projects: ProjectListResolver },
  }, {
    path: ':projectId/environments/:envId',
    component: EnvironmentShowComponent,
    resolve: { env: EnvironmentResolver },
  }, {
    path: ':id/management',
    component: ManagementComponent,
    resolve: { project: ManagementResolver }
  }
];
