import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '@app/account/projects/project.service';
import { SpecialProjectService } from '@app/account/projects/special-project.service';
import { ProjectWithUsers } from '@app/core/models';
import { InputDialogComponent } from '@app/shared/input-dialog/dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './list.component.html'
})
export class ProjectListComponent implements OnInit {

  public commonProjects: ProjectWithUsers[];
  public archivedProjects: ProjectWithUsers[];
  public specialProjects: ProjectWithUsers[];

  private projects: ProjectWithUsers[];
  private specialProjectIds: Number[];

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private specialProjectService: SpecialProjectService
  ) { }

  ngOnInit() {
    this.projects = this.route.snapshot.data.projects;

    this.specialProjectService
      .specialProjectIds
      .subscribe((ids) => {
        this.specialProjectIds = ids;
        this.sortProjects(this.projects);
      });
  }

  public filterProjects(substring: string) {
    this.projectService
      .list(substring, true, false)
      .subscribe((projects) => {
        this.projects = <ProjectWithUsers[]> projects;
        this.sortProjects(this.projects);
      });
  }

  private sortProjects(projects) {
    this.commonProjects = [];
    this.archivedProjects = [];
    this.specialProjects = [];

    projects.forEach((project) => {
      if (project.archived) {
        this.archivedProjects.push(project);
      } else if (this.specialProjectIds.includes(project.id)) {
        this.specialProjects.push(project);
      } else {
        this.commonProjects.push(project);
      }
    });
  }

  public showCreateProjectModal() {
    const data = {
      onSubmit: (self) => {
        self.isLoading = true;

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
      title: 'Введите название проекта',
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
