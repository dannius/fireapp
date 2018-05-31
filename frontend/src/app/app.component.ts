import { Component, OnInit } from '@angular/core';
import { DemoSdkService } from '@app/demo-sdk.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {

  constructor(
    private sdkService: DemoSdkService
  ) { }

  ngOnInit() {
    // put here sdkKey and environment name for tests.
    // test errors will come when signin and signup
    // note that you must create environment in accout before use it here

    this.sdkService.setup('u1UK/TZmpay7w2wwgpCH6iMrNTP4U9V6', 'dino_dev');
  }
}
