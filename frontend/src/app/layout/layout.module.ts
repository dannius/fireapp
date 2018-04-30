import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@app/shared/shared.module';

import { AuthLayoutComponent } from '@app/layout/auth-layout/auth-layout.component';

@NgModule({
  declarations: [
    AuthLayoutComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
  ],
  exports: [
    AuthLayoutComponent
  ]
})
export class LayoutModule { }
