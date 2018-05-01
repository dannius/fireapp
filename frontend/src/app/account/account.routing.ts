import { Routes } from '@angular/router';
import { ProfileSettingsComponent } from '@app/account/profile-settings/profile-settings.component';
import { ProjectListComponent } from '@app/account/projects/list/list.component';

export const AccountRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      redirectTo: 'projects'
    }, {
      path: 'projects',
      component: ProjectListComponent
    }, {
      path: 'settings',
      component: ProfileSettingsComponent
    }]
  }
];
