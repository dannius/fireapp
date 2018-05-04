import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project, ProjectWithUsers } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';

@Component({
  selector: 'app-project-show',
  templateUrl: './show.component.html'
})
export class ProjectShowComponent implements OnInit, OnDestroy {

  private project: ProjectWithUsers;

  constructor(
    private route: ActivatedRoute,
    private pubSubService: PubSubService
  ) { }

  ngOnInit() {
    this.project = this.route.snapshot.data.project;

    this.pubSubService
      .setProject(Project.fromJson(this.project));
  }

  ngOnDestroy() {
    this.pubSubService.setProject(null);
  }
}
