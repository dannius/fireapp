import '@app/shared/rxjs-operators';

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UserDataSource } from '@app/account/user-list/user.data-source';
import { UserService } from '@app/account/user.service';
import { FormControl } from '@angular/forms';
import { ProjectService } from '@app/account/projects/project.service';
import { Project } from '@app/core/models';
import { Observable } from 'rxjs/Observable';
import { PubSubService } from '@app/core/pub-sub.service';
import { BindingService } from '@app/account/user-list/binding.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {

  public userHelper: any = {};

  public dataSource: UserDataSource;
  public displayedColumns = ['email', 'name', 'commonProjects', 'yoursProjects', 'actions'];
  public pageSizeOptions = [10, 20, 50, 100];
  public pageSize = 10;

  private projectList: Project[];

  constructor(
    private userService: UserService,
    private pubSubService: PubSubService,
    private projectService: ProjectService,
    private bindingService: BindingService
  ) { }

  ngOnInit() {
    this.projectService.ownershipList()
      .subscribe((projects) => {
        this.projectList = projects;

        this.dataSource = new UserDataSource(
          this.userService,
          this.pubSubService,
          this.projectList
        );
      });

    this.pubSubService
      .userHelper
      .subscribe((helper) => {
        if (!helper) {
          return;
        }

        for (const index of Object.keys(helper)) {
          const { selectedIds } = helper[index];
          helper[index].selectedNames = this.getCommonProjectNamesByIds(selectedIds, this.projectList);
        }

        this.userHelper = helper;
      });
  }

  public filterProjects(value) {

  }

  public togglePanel(openAction, userId, projectIds) {
    let unbindingProjectIds = [];
    let bindingProjectIds = [];

    if (openAction) {
      this.userHelper[userId].selectedOnOpen = projectIds;
    } else {
      this.userHelper[userId].selectedOnClose = projectIds;
      bindingProjectIds = this.getBindingProjectsIds(this.userHelper[userId].selectedOnOpen, this.userHelper[userId].selectedOnClose);
      unbindingProjectIds = this.getUnbindingProjectsIds(this.userHelper[userId].selectedOnOpen, this.userHelper[userId].selectedOnClose);
    }

    if (openAction || !(bindingProjectIds.length || unbindingProjectIds.length)) {
      return;
    }

    this.userHelper[userId].isLoading = false;

    if (bindingProjectIds.length && unbindingProjectIds.length) {
      Observable
        .forkJoin(
          this.bindingService.bind(userId, bindingProjectIds),
          this.bindingService.unbind(userId, unbindingProjectIds)
        )
        .subscribe(([bindingIds, unbindingIds]) => {
          this.mergeAndRemoveIds(bindingIds, unbindingIds, userId);
        });

    } else if (bindingProjectIds.length) {
      this.bindingService.bind(userId, bindingProjectIds)
      .subscribe((ids) => {
        this.mergeBindingsIds(ids, userId);
      });

    } else if (unbindingProjectIds.length) {
      this.bindingService.unbind(userId, unbindingProjectIds)
      .subscribe((ids) => {
        this.removeUnbindingIds(ids, userId);
      });
    }
  }

  public toggleProject({ value }, userId) {
    this.userHelper[userId].selectedIds = value || [];
  }

  private getBindingProjectsIds(openedIds, closedIds) {
    return closedIds.filter((closedId) => {
      return !openedIds.includes(closedId);
    });
  }

  private getUnbindingProjectsIds(openedIds, closedIds) {
    return openedIds.filter((openedId) => {
      return !closedIds.includes(openedId);
    });
  }

  private getCommonProjectNamesByIds(ids: number[], projects: Project[]) {
    const n = ids.reduce((names, id) => {
      names.push(projects && projects.find((p) => p.id === id).name);
      return names;
    }, []);
    return n;
  }

  private mergeAndRemoveIds(bindingIds, unbindingIds, userId) {
    this.userHelper[userId].selectedIds = [
      ...this.getUnbindingProjectsIds(this.userHelper[userId].selectedOnOpen, unbindingIds),
      ...bindingIds
    ];
    this.setNamesToHelperByProjectIds(this.userHelper[userId].selectedIds, userId);
    this.userHelper[userId].isLoading = false;
  }

  private mergeBindingsIds(bindingIds, userId) {
    this.userHelper[userId].selectedIds = [...this.userHelper[userId].selectedOnOpen, ...bindingIds];
    this.setNamesToHelperByProjectIds(this.userHelper[userId].selectedIds, userId);
    this.userHelper[userId].isLoading = false;
  }

  private removeUnbindingIds(unbindingIds, userId) {
    this.userHelper[userId].selectedIds = this.getUnbindingProjectsIds(this.userHelper[userId].selectedOnOpen, unbindingIds);
    this.setNamesToHelperByProjectIds(this.userHelper[userId].selectedIds, userId);
    this.userHelper[userId].isLoading = false;
  }

  private setNamesToHelperByProjectIds(ids, userId) {
    if (this.userHelper[userId]) {
      this.userHelper[userId].selectedNames = this.getCommonProjectNamesByIds(ids, this.projectList);
    }
  }
}

