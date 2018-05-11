import { Component, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { SpecialProjectService } from '@app/account/projects/special-project.service';
import { ProjectWithUsers, User } from '@app/core/models';
import { ConfirmationDialogComponent } from '@app/shared/confirmation-dialog/dialog.component';
import { InputDialogComponent } from '@app/shared/input-dialog/dialog.component';
import { BindingService } from '@app/account/user-list/binding.service';
import { PubSubService } from '@app/core/pub-sub.service';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html'
})
export class ProjectSettingsComponent {

  @Input()
  public project: ProjectWithUsers;

  @Input()
  public isOwner: boolean;

  @Input()
  public currentUser: User;

  private snackBarConfig = {
    duration: 3000
  };

  private snackBarDelay = 500;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private specialProjectService: SpecialProjectService,
    private bindingService: BindingService,
    private pubSubService: PubSubService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  public showLeaveProjectDialog() {
    const data = {
      btnConfirm: 'Покинуть',
      btnClose: 'Отмена',
      title: 'Точно покинуть проект ?'
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data })
      .afterClosed()
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.bindingService
          .unbind(this.currentUser.id, [this.project.id])
          .subscribe((res) => {
            if (res && res.length) {
              this.router.navigate(['/', 'account', 'projects']);

              setTimeout(() => {
                this.snackBar.open(`Вы покинули проект "${this.project.name}"`, '', this.snackBarConfig);
              }, this.snackBarDelay);
            } else {
              this.snackBar.open(`Что то пошло не так`, '', this.snackBarConfig);
            }
          });
      });
  }

  public showArchivationDialog() {
    const data = {
      btnConfirm: 'Архивировать',
      btnClose: 'Отмена',
      title: 'Точно архивировать проект ?'
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data })
      .afterClosed()
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.projectService
          .archive(this.project.id)
          .subscribe((project) => {
            if (project.archived) {
              this.project.archived = true;
              this.snackBar.open(`Проект "${this.project.name}" архивирован`, '', this.snackBarConfig);
            } else {
              this.snackBar.open(`Что то пошло не так`, '', this.snackBarConfig);
            }
          });
      });
  }

  public showRestoreDialog() {
    const data = {
      btnConfirm: 'Восстановить',
      btnClose: 'Отмена',
      title: 'Хотите восстановить проект ?'
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data })
      .afterClosed()
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.projectService
          .unarchive(this.project.id)
          .subscribe((project) => {
            if (!project.archived) {
              this.project.archived = false;
              this.snackBar.open(`Проект "${this.project.name}" восстановлен`, '', this.snackBarConfig);
            } else {
              this.snackBar.open(`Что то пошло не так`, '', this.snackBarConfig);
            }
          });
      });
  }

  public showInputDialog() {
    const data = {
      onSubmit: (self) => {
        if (self.form.value.name === this.project.name) {
          self.dialogRef.close(true);
        } else {
          self.form.get('name').setErrors({ invalidName: true });
        }
      },
      title: `Действие необратимо. Подтвердите удаление проекта, введите его название "${this.project.name}"`,
      btnConfirm: 'Удалить',
      btnClose: 'Отмена',
      inputPlaceholder: 'Название проекта',
      errorMessage: 'Неправильное название'
    };

    this.dialog.open(InputDialogComponent, { data })
      .afterClosed()
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.projectService
          .delete(this.project.id)
          .subscribe((status) => {
            if (status) {
              this.specialProjectService.removeFromSpecialIds(this.project);
              this.pubSubService.setProject(null);
              this.router.navigate(['/', 'account', 'projects']);

              setTimeout(() => {
                this.snackBar.open(`Проект "${this.project.name}" удален`, '', this.snackBarConfig);
              }, this.snackBarDelay);
            } else {
              this.snackBar.open(`Что то пошло не так`, '', this.snackBarConfig);
            }
          });
      });
  }

}
