import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '@app/core/auth';
import { Project } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  @Output()
  public toggleSidenav = new EventEmitter<void>();

  public login: String;
  public project: Project;

  constructor(
    private authService: AuthService,
    private pubSubService: PubSubService
  ) { }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.login = user ? user && user.name ||
                    user && user.email.substring(0, user.email.indexOf('@')) : '';
    });

    this.pubSubService.project.subscribe((project) => {
      this.project = project;
    });
  }

  public logout(): void {
    this.authService.logout();
  }
}
