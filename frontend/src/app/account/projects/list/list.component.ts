import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-project-list',
  templateUrl: './list.component.html'
})
export class ProjectListComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

  public filterProjects(substring: string) {
    console.log(substring);
  }

}
