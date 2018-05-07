import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Project } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-account',
  templateUrl: './account-layout.component.html'
})
export class AccountLayoutComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav')
  public sidenav: MatSidenav;

  public project: Project;
  private subscriber: Subscription;

  constructor(
    private pubSubService: PubSubService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.subscriber = this.pubSubService.project.subscribe((project) => {
        this.project = project;
        this.cdRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public toggleSidenav() {
    this.sidenav.toggle();
  }
}
