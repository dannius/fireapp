import '@app/shared/rxjs-operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { Project } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';
import { Observable } from 'rxjs/Observable';
import { EnvironmentService } from '@app/account/environment.service';

@Injectable()
export class EnvironmentResolver implements Resolve<Observable<any>> {
  private project: Project;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private pubSubService: PubSubService,
    private envService: EnvironmentService
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const projectId = +route.params['projectId'];
    const envId = +route.params['envId'];

    if (!projectId) {
      this.router.navigate(['404']);
      return Observable.of(null);
    }

    this.pubSubService.project.take(1)
      .subscribe((project) => {
        this.project = project;
      });

    if (this.project && this.project.id === projectId) {
      return Observable.forkJoin(
        Observable.of(this.project),
        this.envService.list(envId, projectId)
      );
    } else {
      return Observable.forkJoin(
        this.projectService.get(projectId)
        .switchMap((project: any) => {
          if (project === 404) {
            this.router.navigate(['404']);
            return Observable.of(null);
          }
          return Observable.of(project);
        }),
        this.envService.list(envId, projectId)
      );
    }
  }
}

