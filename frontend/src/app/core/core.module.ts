import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthGuard, AuthService, TokenInterceptor, TokenService } from '@app/core/auth';
import { FormHelperService } from '@app/core/form-helper/form-helper.service';

@NgModule({
  providers: [
    AuthService,
    FormHelperService,
    AuthGuard,
    TokenService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
  ]
})

export class CoreModule {
  // NOTE: we constrain importing this module to top level module (AppModule) only
  // This is done so that services listed here will be singletons
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
