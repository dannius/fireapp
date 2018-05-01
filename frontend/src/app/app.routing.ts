import { Routes } from '@angular/router';
import { AuthGuard } from '@app/core/auth';
import { AuthLayoutComponent } from '@app/layout';
import { AccountLayoutComponent } from '@app/layout';

export const AppRoutes: Routes = [
{
  path: '',
  canActivate: [ AuthGuard ],
  pathMatch: 'full',
  redirectTo: 'account'
},
{
  path: '',
  component: AccountLayoutComponent,
  children: [{
    path: 'account',
    canActivate: [ AuthGuard ],
    loadChildren: './account/account.module#AccountModule'
  }],
},
{
  path: '',
  component: AuthLayoutComponent,
  children: [{
    path: 'session',
    loadChildren: './session/session.module#SessionModule'
  }]
},
{
  path: '**',
  redirectTo: 'session/404'
}];
