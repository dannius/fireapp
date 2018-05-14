import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';
import { Error } from '@app/core/models/error';

@Component({
  selector: 'app-project-show',
  templateUrl: './show.component.html'
})
export class EnvironmentShowComponent implements OnInit {

  public errors: Error[];
  private project: Project;

  constructor(
    private route: ActivatedRoute,
    private pubSubService: PubSubService
  ) { }

  ngOnInit() {
    this.route.data
    .subscribe(({ env }) => {
      const [project, errors] = env;
      if (!this.project || this.project.id !== project.id) {
        this.project = project;
      }

      this.errors = errors;
      this.pubSubService.setProject(this.project);
    });
  }
}
