import { Routes } from '@angular/router';
import { EventListComponent } from '@app/account/event/event-list/event-list.component';
import { ProfileSettingsComponent } from '@app/account/profile-settings/profile-settings.component';

export const AccountRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      redirectTo: 'events'
    }, {
      path: 'events',
      component: EventListComponent
    }, {
      path: 'settings',
      component: ProfileSettingsComponent
    }]
  }
];
