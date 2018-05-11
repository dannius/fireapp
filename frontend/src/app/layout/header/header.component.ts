import '@app/shared/rxjs-operators';

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { SpecialProjectService } from '@app/account/projects/special-project.service';
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

  public commonProjects: Project[];
  public archivedProjects: Project[];
  public specialProjects: Project[];
  public allProjects: Project[];

  private specialProjectIds: Number[];

  constructor(
    private authService: AuthService,
    private pubSubService: PubSubService,
    private projectService: ProjectService,
    private specialProjectService: SpecialProjectService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.login = user ? user && user.name || user && user.email : '';
    });

    this.specialProjectService
      .specialProjectIds
      .switchMap((ids) => {
        this.specialProjectIds = ids;
        return this.projectService.list('', false, false);
      })
      .switchMap((projects) => {
        this.allProjects = projects;
        return this.pubSubService.project;
      })
      .subscribe((project) => {
        this.project = project;

        if (!this.allProjects) {
          return;
        }
        if (this.project && !this.isProjectsIncludeProject()) {
          this.allProjects.push(project);
        }

        if (this.project) {
          this.allProjects = this.allProjects.map((p) => p.id === this.project.id ? project : p);
        }

        this.sortProjects();
      });

  }

  public selectProject({ value }): void {
    this.router.navigate(['/', 'account', 'projects', value]);
  }

  public logout(): void {
    this.authService.logout();
  }

  private isProjectsIncludeProject(): boolean {
    return !!(this.allProjects.find((project) =>
                project.id === this.project.id));
  }

  private sortProjects() {
    this.commonProjects = [];
    this.archivedProjects = [];
    this.specialProjects = [];

    this.allProjects.forEach((project) => {
      if (project.archived) {
        this.archivedProjects.push(project);
      } else if (this.specialProjectIds.includes(project.id)) {
        this.specialProjects.push(project);
      } else {
        this.commonProjects.push(project);
      }
    });
  }
}
