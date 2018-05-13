import '@app/shared/rxjs-operators';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/core/auth';
import { Project, User } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-project-management',
  templateUrl: './management.component.html'
})
export class ManagementComponent implements OnInit {

  public project: Project;
  public user: User;

  constructor(
    private pubSubService: PubSubService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    const projectObservable = this.route.data
      .switchMap(({ project }) => {
        if (!this.project || this.project.id !== project.id) {
          this.project = project;
        }

        this.pubSubService.setProject(project);
        return this.authService.user;
      })
      .subscribe((user) => {
        this.user = user;
        this.project.users = this.project.users.filter((u) => this.user && u.id !== this.user.id);
      });
  }

  public isOwnership(): Boolean {
    return this.project && this.user && this.project.ownerId === this.user.id;
  }

}
