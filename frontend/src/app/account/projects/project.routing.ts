import { Routes } from '@angular/router';
import { ProjectListComponent } from '@app/account/projects/list/list.component';
import { ProjectListResolver } from '@app/account/projects/list/list.resolver';
import { ManagementComponent } from '@app/account/projects/management/management.component';
import { ManagementResolver } from '@app/account/projects/management/management.resolver';
import { ErrorListComponent } from '@app/account/projects/environment/error-list/error-list.component';
import { ErrorResolver } from '@app/account/projects/environment/error-list/error.resolver';

export const ProjectRoutes: Routes = [
  {
    path: '',
    component: ProjectListComponent,
    resolve: { projects: ProjectListResolver },
  }, {
    path: ':projectId/environments/:envId',
    component: ErrorListComponent,
    resolve: { env: ErrorResolver },
  }, {
    path: ':id/management',
    component: ManagementComponent,
    resolve: { project: ManagementResolver }
  }
];
