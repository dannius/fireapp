import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorDialogComponent } from '@app/account/projects/environment/error-dialog/error-dialog.component';
import { Project, User } from '@app/core/models';
import { Error } from '@app/core/models/error';

@Component({
  selector: 'app-error-item',
  templateUrl: './error-item.component.html'
})
export class ErrorItemComponent implements OnInit {

  @Input()
  public error: Error;

  @Input()
  public project: Project;

  public performer: User;

  constructor(
    private matDialog: MatDialog
  ) { }

  ngOnInit() {
    this.performer = this.error.user;
  }

  public showDialog() {
    const data = {
      error: this.error,
      users: this.project.users
    };

    this.matDialog
      .open(ErrorDialogComponent, { data })
      .afterClosed()
      .subscribe((error) => {
        if (error instanceof Error) {
          this.error = error;
          this.performer = error.user;
        }
      });
  }

}
