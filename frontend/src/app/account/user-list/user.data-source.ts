import { DataSource } from '@angular/cdk/table';
import { UserService } from '@app/account/user.service';
import { Observable } from 'rxjs/Observable';
import { User, Project } from '@app/core/models';
import { ProjectService } from '@app/account/projects/project.service';
import { PubSubService } from '@app/core/pub-sub.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { catchError } from 'rxjs/operators/catchError';
import { finalize } from 'rxjs/operators/finalize';

export class UserDataSource extends DataSource<any> {

  private userHelper = {};
  private dataSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  public length: number;

  constructor(
    private userService: UserService,
    private pubSubService: PubSubService,
    private projects: Project[]
    ) {
    super();
  }

  connect(): Observable<User[]> {
    return this.dataSubject.asObservable();
  }

  disconnect() {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  public loadList(substring, limit, page): void {
    this.loadingSubject.next(true);

    this.userService
      .list(substring, limit, page)
      .pipe(
        catchError(() => Observable.of({ users: [], length: 0 })),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(({users, length }) => {
        this.length = length;

        users = users.map((user) => {
          this.userHelper[`${user.id}`] = {
            selectedIds: this.getCommonProjectIds(user.projects, this.projects),
            selectedNames: []
          };

          // include only projects which not current user ownership
          user.projects = user.projects.filter((project) => {
            return !this.userHelper[user.id].selectedIds.includes(project.id);
          });

          // setup projects
          const archivedProjects = [];
          const commonProjects = [];
          this.projects.forEach((p) => {
            if (p.archived) {
              archivedProjects.push(p);
            } else {
              commonProjects.push(p);
            }
          });

          return {
            ...user,
            selectedProjectIds: this.userHelper[user.id].selectedIds,
            commonProjects: commonProjects,
            archivedProjects: archivedProjects,
          };
        });

        this.pubSubService.setUserHelper(this.userHelper);
        this.dataSubject.next(users);
      });
  }

  private getCommonProjectIds(proj1: Project[], proj2: Project[]) {
    const ids = proj1.reduce((commonIds, p1) => {
      proj2.forEach((p2) => {
        if (p1.id === p2.id && !commonIds.includes(p1.id)) {
          commonIds.push(p1.id);
        }
      });
      return commonIds;
    }, []);
    return ids;
  }
}
