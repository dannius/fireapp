import { Component, Input } from '@angular/core';
import { SpecialProjectService } from '@app/account/projects/special-project.service';
import { Project } from '@app/core/models';

@Component({
  selector: 'app-project-item',
  templateUrl: './item.component.html'
})
export class ProjectItemComponent {

  @Input()
  project: Project;

  @Input()
  special: boolean;

  constructor(
    private specialProjectService: SpecialProjectService
  ) { }

  public toggleSpecial(event) {
    event.preventDefault();
    event.stopPropagation();

    if (this.special) {
      this.specialProjectService.removeFromSpecialIds(this.project);
    } else {
      this.specialProjectService.setToSpecialIds(this.project);
    }
  }

}
