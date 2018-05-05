import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProjectDialogComponent } from '@app/account/projects/create-dialog/dialog.component';
import { ProjectService } from '@app/account/projects/project.service';
import { ProjectWithUsers } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';

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
    this.dialog
      .open(CreateProjectDialogComponent)
      .afterClosed()
      .subscribe((id: number) => {
        if (id) {
          this.router.navigate(['/', 'account', 'projects', id, 'management']);
        }
      });
  }
}
