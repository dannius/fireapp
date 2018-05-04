import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';

@Component({
  selector: 'app-project-management',
  templateUrl: './management.component.html'
})
export class ManagementComponent implements OnInit, OnDestroy {

  public project: Project;

  constructor(
    private pubSubService: PubSubService,
    private route: ActivatedRoute
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
