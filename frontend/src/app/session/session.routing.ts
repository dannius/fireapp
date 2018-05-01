import { Routes } from '@angular/router';
import { NotFoundComponent } from '@app/session/not-found/not-found.component';
import { SigninComponent } from '@app/session/signin/signin.component';

import { SignupComponent } from './signup/signup.component';

export const SessionRoutes: Routes = [
  {
    path: '',
    children: [{
      path: '',
      redirectTo: 'signin'
    }, {
      path: 'signin',
      component: SigninComponent
    }, {
      path: 'signup',
      component: SignupComponent
    }, {
      path: '404',
      component: NotFoundComponent
    }]
  }
];
