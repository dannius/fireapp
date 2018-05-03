import '@app/shared/rxjs-operators';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectManagementResolver implements Resolve<Observable<number>> {

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const id = +route.params['id'];

    if (!id) {
      this.router.navigate(['404']);
      return Observable.of(null);
    }

    return Observable.of(id);
  }
}
