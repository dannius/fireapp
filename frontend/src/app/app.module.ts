import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { AppRoutes } from '@app/app.routing';
import { CoreModule } from '@app/core/core.module';
import { DemoSdkService } from '@app/demo-sdk.service';
import { LayoutModule } from '@app/layout';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    CoreModule,
    LayoutModule,
    HttpClientModule,
  ],
  providers: [
    // DEMO SDK
    DemoSdkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
