import { Routes } from '@angular/router';
import { AuthGuard } from '@app/core/auth/auth.guard';
import { AuthLayoutComponent } from '@app/layout';

export const AppRoutes: Routes = [
{
  path: '',
  canActivate: [ AuthGuard ],
  pathMatch: 'full',
  redirectTo: 'session/signin'
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
