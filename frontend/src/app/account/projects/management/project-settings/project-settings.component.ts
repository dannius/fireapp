import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { SpecialProjectService } from '@app/account/projects/special-project.service';
import { Project, User } from '@app/core/models';
import { ConfirmationDialogComponent } from '@app/shared/confirmation-dialog/dialog.component';
import { InputDialogComponent } from '@app/shared/input-dialog/dialog.component';
import { BindingService } from '@app/account/user-list/binding.service';
import { PubSubService } from '@app/core/pub-sub.service';
import { Environment } from '@app/core/models/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { EnvironmentService } from '@app/account/environment.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html'
})
export class ProjectSettingsComponent implements OnInit {

  @Input()
  public project: Project;

  @Input()
  public isOwner: boolean;

  @Input()
  public currentUser: User;

  public currentEnv = new BehaviorSubject<Environment>(null);
  public editForm: FormGroup;

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
    private envService: EnvironmentService,
    private dialog: MatDialog,
    private builder: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.currentEnv
    .subscribe((env) => {
      if (env) {
        this.initEditEnvForm(env);
      } else {
        this.editForm = null;
      }
    });
  }

  private initEditEnvForm(env) {
    this.editForm = this.builder.group({
      name: [env.name, Validators.required],
      id: [env.id, Validators.required]
    });
  }

  public updateEnv() {
    if (this.editForm.value.name === this.currentEnv.getValue().name) {
      this.currentEnv.next(null);
      return;
    }

    this.envService.update(this.editForm.value)
    .subscribe((env) => {
      if (env) {
        this.project.environments = this.project.environments.map((environment) => {
          return environment.id === env.id ? env : environment;
        });

        this.currentEnv.next(null);
        this.snackBar.open(`Информация обновлена`, '', this.snackBarConfig);
      } else {
        this.editForm.get('name').setErrors({ existName: true });
      }
    });
  }

  public showDeleteEnvDialog() {
    const data = {
      btnConfirm: 'Подтвердить',
      btnClose: 'Отмена',
      title: `Удалить среду разработки "${this.currentEnv.getValue().name}" ? Все события так же удалятся.`
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data })
      .afterClosed()
      .switchMap((state: boolean) => {
        if (!state) {
          return Observable.of(null);
        } else {
          return this.envService.delete(this.editForm.value.id);
        }
      })
      .subscribe((env) => {
        if (env) {
          this.project.environments = this.project.environments.filter((environment) => {
            return environment.id !== env.id;
          });

          this.currentEnv.next(null);
          this.snackBar.open(`Информация обновлена`, '', this.snackBarConfig);
        }
      });
  }

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
              this.pubSubService.setProject(null);

              setTimeout(() => {
                this.snackBar.open(`Вы покинули проект "${this.project.name}"`, '', this.snackBarConfig);
              }, this.snackBarDelay);
            } else {
              this.snackBar.open(`Что то пошло не так`, '', this.snackBarConfig);
            }
          });
      });
  }

  public showResetSdkDialog() {
    const data = {
      btnConfirm: 'Подтвердить',
      btnClose: 'Отмена',
      title: 'Сгенерировать новый sdk ключ ?'
    };

    this.dialog
      .open(ConfirmationDialogComponent, { data })
      .afterClosed()
      .subscribe((state: boolean) => {
        if (!state) {
          return;
        }

        this.projectService
          .resetSdkKey(this.project.id)
          .subscribe((key) => {
            if (typeof key === 'string') {
              this.snackBar.open(`Ключ проекта ${this.project.name} изменен`, '', this.snackBarConfig);
              this.project.sdkKey = key;
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
