import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProjectDialogComponent } from '@app/account/projects/create-dialog/dialog.component';
import { ProjectService } from '@app/account/projects/project.service';
import { ProjectWithUsers } from '@app/core/models';

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
    private router: Router
  ) { }

  ngOnInit() {
    this.projects = this.route.snapshot.data.projects;
  }

  public filterProjects(substring: string) {
    this.projectService
      .filter(substring)
      .subscribe((projects) => {
        this.projects = projects;
      });

  }

  public toggleCreateProjectModal() {
    this.dialog
      .open(CreateProjectDialogComponent)
      .afterClosed()
      .subscribe((id: number) => {
        if (id) {
          this.router.navigate([id, 'management'], { relativeTo: this.route });
        }
      });
  }
}
