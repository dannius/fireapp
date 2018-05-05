import '@app/shared/rxjs-operators';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
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
  public projects: Project[];

  constructor(
    private authService: AuthService,
    private pubSubService: PubSubService,
    private projectService: ProjectService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.login = user ? user && user.name ||
                    user && user.email.substring(0, user.email.indexOf('@')) : '';
    });

    this.projectService.list()
      .switchMap((projects) => {
        this.projects = projects;
        return this.pubSubService.project;
      })
      .subscribe((project) => {
        this.project = project;

        if (this.project && !this.isProjectsIncludeProject()) {
          this.projects.push(project);
        }
      });
  }

  public selectProject({ value }): void {
    this.router.navigate(['/', 'account', 'projects', value]);
  }

  public logout(): void {
    this.authService.logout();
  }

  private isProjectsIncludeProject(): boolean {
    return !!(this.projects.filter((project) =>
                project.id === this.project.id)).length;
  }
}
