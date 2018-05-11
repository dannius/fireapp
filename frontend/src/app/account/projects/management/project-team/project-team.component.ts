import { Component, Input } from '@angular/core';
import { ProjectWithUsers, User } from '@app/core/models';

@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html'
})
export class ProjectTeamComponent {

  @Input()
  public project: ProjectWithUsers;

  @Input()
  public isOwner: boolean;

  constructor() { }

}
