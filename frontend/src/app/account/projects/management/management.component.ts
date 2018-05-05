import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-project-management',
  templateUrl: './management.component.html'
})
export class ManagementComponent implements OnInit {

  public project: Project;

  constructor(
    private pubSubService: PubSubService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data
    .switchMap(({ project }) => {
      if (!this.project || this.project.id !== project.id) {
        this.project = project;
      }

      return Observable.of(project);
    })
    .subscribe((project) => {
      this.pubSubService
        .setProject(Project.fromJson(this.project));
    });
  }

}
