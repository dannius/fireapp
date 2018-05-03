import '@app/shared/rxjs-operators';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ProjectService } from '@app/account/projects/project.service';
import { ProjectWithUsers } from '@app/core/models';

@Injectable()
export class ProjectListResolver implements Resolve<Observable<ProjectWithUsers[]>> {

  constructor(
    private projectService: ProjectService
  ) { }

  resolve() {
    return this.projectService.list();
  }
}
