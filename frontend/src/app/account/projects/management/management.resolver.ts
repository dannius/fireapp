import '@app/shared/rxjs-operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { ProjectWithUsers } from '@app/core/models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ManagementResolver implements Resolve<Observable<number>> {

  constructor(
    private projectService: ProjectService,
    private router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const id = +route.params['id'];

    if (!id) {
      this.router.navigate(['404']);
      return Observable.of(null);
    }

    return this.projectService.get(id)
      .switchMap((project: ProjectWithUsers | number) => {

        if (project === 404) {
          this.router.navigate(['404']);
          return Observable.of(null);
        }

        return Observable.of(project);
      });
  }
}
