import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Project } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';

@Component({
  selector: 'app-account',
  templateUrl: './account-layout.component.html'
})
export class AccountLayoutComponent implements OnInit {

  @ViewChild('sidenav')
  public sidenav: MatSidenav;

  public project: Project;

  constructor(
    private pubSubService: PubSubService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.pubSubService.project.subscribe((project) => {
        this.project = project;
        this.cdRef.detectChanges();
    });
  }

  public toggleSidenav() {
    this.sidenav.toggle();
  }
}
