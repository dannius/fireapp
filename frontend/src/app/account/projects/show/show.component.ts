import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-project-show',
  templateUrl: './show.component.html'
})
export class ProjectShowComponent implements OnInit {

  private project: Project;

  constructor(
    private route: ActivatedRoute,
    private pubSubService: PubSubService
  ) { }

  ngOnInit() {
    this.route.data
    .subscribe(({ project }) => {
      if (!this.project || this.project.id !== project.id) {
        this.project = project;
      }
      this.pubSubService.setProject(this.project);
    });
  }
}
