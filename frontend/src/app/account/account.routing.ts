import { Routes } from '@angular/router';
import { ProfileSettingsComponent } from '@app/account/profile-settings/profile-settings.component';
import { UserListComponent } from '@app/account/user-list/user-list.component';

export const AccountRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      pathMatch: 'full',
      redirectTo: 'projects'
    }, {
      path: 'users',
      component: UserListComponent
    }, {
      path: 'projects',
      loadChildren: './projects/project.module#ProjectModule'
    }, {
      path: 'settings',
      component: ProfileSettingsComponent
    }]
  }
];
