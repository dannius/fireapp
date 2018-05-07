import '@app/shared/rxjs-operators';

import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { SpecialProjectService } from '@app/account/projects/special-project.service';
import { AuthService } from '@app/core/auth';
import { ProjectWithUsers, User } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';
import { ConfirmationDialogComponent } from '@app/shared/confirmation-dialog/dialog.component';
import { InputDialogComponent } from '@app/shared/input-dialog/dialog.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-project-management',
  templateUrl: './management.component.html'
})
export class ManagementComponent implements OnInit {

  public project: ProjectWithUsers;
  public user: User;


  private snackBarConfig = {
    duration: 3000
  };

  constructor(
    private pubSubService: PubSubService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private specialProjectService: SpecialProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    const projectObservable = this.route.data
      .switchMap(({ project }) => {
        if (!this.project || this.project.id !== project.id) {
          this.project = project;
        }

        this.pubSubService.setProject(project);
        return Observable.of(project);
      });


    Observable
      .forkJoin(
        projectObservable.take(1),
        this.authService.user.take(1)
      )
      .subscribe(([project, user]) => {
        this.user = user;
        this.project.users = this.project.users.filter((u) => u.id !== this.user.id);
      });
  }

  public isOwnership(): Boolean {
    return this.project && this.user && this.project.owner_id === this.user.id;
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
          .subscribe((project) => {
            if (project) {
              this.specialProjectService.removeFromSpecialIds(this.project);
              const snackBarDelay = 500;
              this.router.navigate(['/', 'account', 'projects']);

              setTimeout(() => {
                this.snackBar.open(`Проект "${this.project.name}" удален`, '', this.snackBarConfig);
              }, snackBarDelay);
            } else {
              this.snackBar.open(`Что то пошло не так`, '', this.snackBarConfig);
            }

          });
      });
  }

}
