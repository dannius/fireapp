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
    this.sdkService.setup('4VDTs5wF8SE2Uhw80qeLWFnf915B/zBS', 'dino_test');
  }
}
