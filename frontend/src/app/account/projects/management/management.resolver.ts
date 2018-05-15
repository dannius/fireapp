import '@app/shared/rxjs-operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { Project } from '@app/core/models';
import { Observable } from 'rxjs/Observable';
import { PubSubService } from '@app/core/pub-sub.service';

@Injectable()
export class ManagementResolver implements Resolve<Observable<Project>> {
  private project: Project;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private pubSubService: PubSubService
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const id = +route.params['id'];

    if (!id) {
      this.router.navigate(['404']);
      return Observable.of(null);
    }

    this.pubSubService.project.take(1)
      .subscribe((project) => {
        this.project = project;
      });

      if (this.project && this.project.id === id) {
        return Observable.of(this.project);
      } else {
        return this.projectService.get(id)
          .switchMap((project: Project | number) => {

            if (project === 404) {
              this.router.navigate(['404']);
              return Observable.of(null);
            }

            return Observable.of(project);
          });
      }
  }
}
