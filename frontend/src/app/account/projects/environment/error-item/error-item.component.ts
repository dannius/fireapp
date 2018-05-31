import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ErrorDialogComponent } from '@app/account/projects/environment/error-dialog/error-dialog.component';
import { Project, User } from '@app/core/models';
import { Error } from '@app/core/models/error';
import { ConfirmationDialogComponent } from '@app/shared/confirmation-dialog/dialog.component';
import { ErrorService } from '@app/account/projects/error.service';

@Component({
  selector: 'app-error-item',
  templateUrl: './error-item.component.html'
})
export class ErrorItemComponent implements OnInit {

  @Input()
  public error: Error;

  @Input()
  public project: Project;

  @Output()
  public solve: EventEmitter<number> = new EventEmitter();

  public performer: User;

  constructor(
    private dialog: MatDialog,
    private errorService: ErrorService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    const mayBeUser = this.error.user;
    const isExistInProject = mayBeUser && this.project.users &&
                              this.project.users.some((u) => u.id === mayBeUser.id);

    this.performer = isExistInProject ? mayBeUser : null;
  }

  public showEditDialog() {
    const data = {
      error: this.error,
      users: this.project.users
    };

    this.dialog
      .open(ErrorDialogComponent, { data })
      .afterClosed()
      .subscribe((error) => {
        if (error instanceof Error) {
          this.error = error;
          this.performer = error.user;
        }
      });
  }

  public showDoneDialog(errorId: number) {
    const snackBarConfig = {
      duration: 2000
    };

    const data = {
      btnConfirm: 'Да',
      btnClose: 'Нет',
      title: 'Исправили эту ошибку ?'
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data })
      .afterClosed()
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.errorService
          .solve(errorId)
          .subscribe((status) => {
            if (status !== 400) {
              this.snackbar.open('Ошибка помечена как завершенная', '',  snackBarConfig);
              this.solve.emit(errorId);
            } else {
              this.snackbar.open('Что то пошло не так', '',  snackBarConfig);
            }
          });
      });
  }

}
