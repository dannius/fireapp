import { Routes } from '@angular/router';
import { ProjectListComponent } from '@app/account/projects/list/list.component';
import { ProjectListResolver } from '@app/account/projects/list/list.resolver';
import { ManagementComponent } from '@app/account/projects/management/management.component';
import { ProjectShowComponent } from '@app/account/projects/show/show.component';
import { ProjectShowResolver } from '@app/account/projects/show/show.resolver';

export const ProjectRoutes: Routes = [
  {
    path: '',
    component: ProjectListComponent,
    resolve: { projects: ProjectListResolver },
  }, {
    path: ':id',
    component: ProjectShowComponent,
    resolve: { project: ProjectShowResolver },
  }, {
    path: ':id/management',
    component: ManagementComponent,
    resolve: { project: ProjectShowResolver }
  }
];
