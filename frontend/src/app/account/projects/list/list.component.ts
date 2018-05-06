import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { ProjectWithUsers } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';
import { InputDialogComponent } from '@app/shared/input-dialog/dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './list.component.html'
})
export class ProjectListComponent implements OnInit {

  public projects: ProjectWithUsers[];

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private pubSubService: PubSubService
  ) { }

  ngOnInit() {
    this.projects = this.route.snapshot.data.projects;
    this.pubSubService.setProject(null);
  }

  public filterProjects(substring: string) {
    this.projectService
      .filteredListWithUsers(substring)
      .subscribe((projects) => {
        this.projects = projects;
      });

  }

  public toggleCreateProjectModal() {
    const data = {
      onSubmit: (self) => {
        this.projectService
        .create(self.form.value.name)
        .subscribe(({ id }) => {
          self.isLoading = false;

          if (id) {
            self.dialogRef.close(id);
          } else {
            self.form.get('name').setErrors({ alreadyExist: true });
          }
        });
      },
      btnConfirm: 'Создать',
      btnClose: 'Отмена',
      inputPlaceholder: 'Название проекта',
      errorMessage: 'Такое название уже занято'
    };

    this.dialog
      .open(InputDialogComponent, { data })
      .afterClosed()
      .subscribe((id: number) => {
        if (id) {
          this.router.navigate(['/', 'account', 'projects', id, 'management']);
        }
      });
  }
}
