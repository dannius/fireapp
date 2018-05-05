import { Component, OnInit } from '@angular/core';
import { PubSubService } from '@app/core/pub-sub.service';

@Component({
  selector: 'app-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent implements OnInit {

  constructor(private pubSubService: PubSubService) { }

  ngOnInit() {
    this.pubSubService.setProject(null);
  }
}
