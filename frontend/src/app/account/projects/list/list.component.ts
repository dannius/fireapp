import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateProjectDialogComponent } from '@app/account/projects/create-dialog/dialog.component';
import { Project, ProjectWithUsers } from '@app/core/models';
import { ProjectService } from '@app/account/projects/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './list.component.html'
})
export class ProjectListComponent implements OnInit {

  public projects: ProjectWithUsers[];

  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.projects = this.route.snapshot.data.projects;
  }

  public filterProjects(substring: string) {
    console.log(substring);
  }

  public toggleCreateProjectModal() {
    this.dialog.open(CreateProjectDialogComponent);
  }
}
