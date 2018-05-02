import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateProjectDialogComponent } from '@app/account/projects/create-dialog/dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './list.component.html'
})
export class ProjectListComponent implements OnInit {

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() { }

  public filterProjects(substring: string) {
    console.log(substring);
  }

  public toggleCreateProjectModal() {
    this.dialog.open(CreateProjectDialogComponent);
  }
}
