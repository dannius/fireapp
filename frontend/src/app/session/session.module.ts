import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from '@app/session/not-found/not-found.component';
import { SessionRoutes } from '@app/session/session.routing';
import { SigninComponent } from '@app/session/signin/signin.component';
import { SignupComponent } from '@app/session/signup/signup.component';
import { SharedModule } from '@app/shared';

@NgModule({
  imports: [
    RouterModule.forChild(SessionRoutes),
    SharedModule,
  ],
  declarations: [
    SigninComponent,
    SignupComponent,
    NotFoundComponent
  ]
})

export class SessionModule {}
