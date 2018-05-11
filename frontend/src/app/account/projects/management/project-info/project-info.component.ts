import { Component, Input } from '@angular/core';
import { ProjectWithUsers, User } from '@app/core/models';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html'
})
export class ProjectInfoComponent {

  @Input()
  public project: ProjectWithUsers;

  @Input()
  public isOwner: boolean;

  constructor(private snackBar: MatSnackBar) { }

  public copyToClipboard() {
    const snackBarConfig = {
      duration: 2000
    };

    this.snackBar.open('Ключ скопирован', '', snackBarConfig);
  }
}