import { Component, Input } from '@angular/core';
import { Project, User } from '@app/core/models';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html'
})
export class ProjectInfoComponent {

  @Input()
  public project: Project;

  @Input()
  public isOwner: boolean;

  @Input()
  public user: User;

  constructor(private snackBar: MatSnackBar) { }

  public copyToClipboard() {
    const snackBarConfig = {
      duration: 2000
    };

    this.snackBar.open('Ключ скопирован', '', snackBarConfig);
  }

  public filteredUsers() {
    return this.project.users.filter((u) => this.user && u.id !== this.user.id);
  }
}
