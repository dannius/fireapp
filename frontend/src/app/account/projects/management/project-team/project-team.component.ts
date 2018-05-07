import { Component, Input } from '@angular/core';
import { ProjectWithUsers } from '@app/core/models';

@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html'
})
export class ProjectTeamComponent {

  @Input()
  public project: ProjectWithUsers;

  constructor() { }

}
