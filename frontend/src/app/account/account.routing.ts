import { Routes } from '@angular/router';
import { ProfileSettingsComponent } from '@app/account/profile-settings/profile-settings.component';

export const AccountRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      pathMatch: 'full',
      redirectTo: 'projects'
    }, {
      path: 'projects',
      loadChildren: './projects/project.module#ProjectModule'
    }, {
      path: 'settings',
      component: ProfileSettingsComponent
    }]
  }
];
