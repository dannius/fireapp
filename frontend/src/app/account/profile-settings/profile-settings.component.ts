import { Component, OnInit } from '@angular/core';
import { PubSubService } from '@app/core/pub-sub.service';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html'
})
export class ProfileSettingsComponent implements OnInit {
  constructor(
    private pubSubService: PubSubService
  ) { }

  ngOnInit() {
    this.pubSubService.setProject(null);
  }
}
