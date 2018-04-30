import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountLayoutComponent } from '@app/layout/account-layout/account-layout.component';
import { AuthLayoutComponent } from '@app/layout/auth-layout/auth-layout.component';
import { HeaderComponent } from '@app/layout/header/header.component';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    AccountLayoutComponent,
    HeaderComponent
  ],
  imports: [
    SharedModule,
    RouterModule,
  ],
  exports: [
    AuthLayoutComponent,
    AccountLayoutComponent,
    HeaderComponent
  ]
})
export class LayoutModule { }
