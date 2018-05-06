import { Component, Input } from '@angular/core';
import { ProjectWithUsers } from '@app/core/models';

@Component({
  selector: 'app-project-item',
  templateUrl: './item.component.html'
})
export class ProjectItemComponent {

  @Input()
  project: ProjectWithUsers;

  constructor() { }

}
