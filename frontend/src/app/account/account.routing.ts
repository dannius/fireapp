import { Routes } from '@angular/router';
import { ProfileSettingsComponent } from '@app/account/profile-settings/profile-settings.component';
import { ProjectListComponent } from '@app/account/projects/list/list.component';
import { ProjectListResolver } from '@app/account/projects/list/list.resolver';

export const AccountRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      redirectTo: 'projects'
    }, {
      path: 'projects',
      component: ProjectListComponent,
      resolve: { projects: ProjectListResolver }
    }, {
      path: 'settings',
      component: ProfileSettingsComponent
    }]
  }
];
