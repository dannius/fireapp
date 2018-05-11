import '@app/shared/rxjs-operators';

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { ProjectWithUsers, Project } from '@app/core/models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProjectListResolver implements Resolve<Observable<Project[] | ProjectWithUsers[]>> {

  constructor(
    private projectService: ProjectService
  ) { }

  resolve() {
    return this.projectService.list('', true, false);
  }
}
