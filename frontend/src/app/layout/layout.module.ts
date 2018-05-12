import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { SpecialProjectService } from '@app/account/projects/special-project.service';
import { AccountLayoutComponent } from '@app/layout/account-layout/account-layout.component';
import { AuthLayoutComponent } from '@app/layout/auth-layout/auth-layout.component';
import { HeaderComponent } from '@app/layout/header/header.component';
import { SharedModule } from '@app/shared';
import { EnvFormComponent } from '@app/account/env-form/env-form.component';
import { EnvironmentService } from '@app/account/environment.service';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    AccountLayoutComponent,
    HeaderComponent,
    EnvFormComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
  ],
  exports: [
    AuthLayoutComponent,
    AccountLayoutComponent,
    HeaderComponent,
    EnvFormComponent
  ],
  providers: [
    ProjectService,
    SpecialProjectService,
    EnvironmentService
  ]
})
export class LayoutModule { }
