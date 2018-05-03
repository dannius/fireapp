import { Routes } from '@angular/router';
import { ProjectListComponent } from '@app/account/projects/list/list.component';
import { ProjectListResolver } from '@app/account/projects/list/list.resolver';
import { ProjectShowComponent } from '@app/account/projects/show/show.component';

export const ProjectRoutes: Routes = [
  {
    path: '',
    component: ProjectListComponent,
    resolve: { projects: ProjectListResolver },
  },
  {
    path: ':id',
    component: ProjectShowComponent
  }
];
