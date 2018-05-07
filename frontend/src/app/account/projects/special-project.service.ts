import { Injectable } from '@angular/core';
import { Project, ProjectWithUsers } from '@app/core/models';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SpecialProjectService {

  private readonly specialProjects = 'specialProjectIds';

  private _specialProjectIds = new BehaviorSubject<Number[]>(null);

  constructor() {
    this.specialProjectIds.subscribe((ids) => {
      localStorage.setItem(this.specialProjects, ids.join(','));
    });
  }

  public get specialProjectIds(): Observable<Number[]> {
    this._specialProjectIds.next(this.getIdsFromLocalStorage());
    return this._specialProjectIds.asObservable();
  }

  public setToSpecialIds({ id }: Project | ProjectWithUsers) {
    const specialProjectIds: Number[] =
      this._specialProjectIds.getValue() || this.getIdsFromLocalStorage();

    specialProjectIds.push(id);

    this._specialProjectIds.next(specialProjectIds);
  }

  public removeFromSpecialIds({ id }: Project | ProjectWithUsers) {
    const specialProjectIds: Number[] =
      this._specialProjectIds.getValue() || this.getIdsFromLocalStorage();

    const index = specialProjectIds.indexOf(id);
    specialProjectIds.splice(index, 1);

    this._specialProjectIds.next(specialProjectIds);
  }

  private getIdsFromLocalStorage(): Number[] {
    const specialProjectIds: any = localStorage.getItem(this.specialProjects);
    return specialProjectIds ? specialProjectIds.split(',').map((id) => +id) : [];
  }

}
