import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Project } from '@app/core/models';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PubSubService {

constructor() { }

  private _project = new BehaviorSubject<Project>(null);

  public get project(): Observable<Project> {
    return this._project.asObservable();
  }

  public setProject(project: Project) {
    this._project.next(project);
  }
}
