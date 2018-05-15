import '@app/shared/rxjs-operators';

import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Project, User } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '@app/core/auth';


@Component({
  selector: 'app-account',
  templateUrl: './account-layout.component.html'
})
export class AccountLayoutComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav')
  public sidenav: MatSidenav;

  public project: Project;

  private subscriber: Subscription;
  private user: User;

  constructor(
    private pubSubService: PubSubService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.subscriber = this.pubSubService.project
      .subscribe((project) => {
        this.project = project;
        this.cdRef.detectChanges();
      });

    this.authService.user
      .take(1)
      .subscribe((user) => {
        this.user = user;
      });
  }

  ngOnDestroy() {
    this.subscriber.unsubscribe();
  }

  public isOwnership(): Boolean {
    return this.project && this.user && this.project.ownerId === this.user.id;
  }

  public toggleSidenav() {
    this.sidenav.toggle();
  }
}
