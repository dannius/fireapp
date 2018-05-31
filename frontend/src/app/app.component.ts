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

    this.sdkService.setup('e6glLJw0Hw/xnN7qT2FBGz2aiw8kvtDF', 'dino_dev');
  }
}
