import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { UserDataSource } from '@app/account/user-list/user.data-source';
import { UserService } from '@app/account/user.service';
import { FormControl } from '@angular/forms';
import { ProjectService } from '@app/account/projects/project.service';
import { Project } from '@app/core/models';
import { Observable } from 'rxjs/observable';
import { PubSubService } from '@app/core/pub-sub.service';

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
  private bindUnbindForm = {
    selectedOnOpen: [],
    selectedOnClose: []
  };

  constructor(
    private userService: UserService,
    private pubSubService: PubSubService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.projectService.list()
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
    console.log(value);
  }

  public togglePanel(openAction, userId, projectIds) {
    let unbindingProjects = [];
    let bindingProjects = [];

    if (openAction) {
      this.bindUnbindForm.selectedOnOpen = projectIds;
    } else {
      this.bindUnbindForm.selectedOnClose = projectIds;
      bindingProjects = this.getBindingProjectsIds(this.bindUnbindForm.selectedOnOpen, this.bindUnbindForm.selectedOnClose);
      unbindingProjects = this.getUnbindingProjectsIds(this.bindUnbindForm.selectedOnOpen, this.bindUnbindForm.selectedOnClose);
    }

    if (openAction || !(bindingProjects.length || unbindingProjects.length)) {
      return;
    }

    this.userHelper[userId].isLoading = true;

    if (bindingProjects.length) {
      console.log(bindingProjects);
    }

    if (unbindingProjects.length) {
      console.log(unbindingProjects);
    }

    if (bindingProjects.length && unbindingProjects.length) {
      console.log(bindingProjects);
    }


    setTimeout(() => {
      const value = true;
      this.userHelper[userId].selectedIds = value ? projectIds : this.bindUnbindForm.selectedOnOpen;
      this.setNamesToHelperByProjectIds(this.userHelper[userId].selectedIds, userId);
      this.userHelper[userId].isLoading = false;
    }, 1000);

  }

  public toggleProject({ value }, userId) {
    this.userHelper[userId] = {
      selectedIds: value || [],
      selectedNames: this.userHelper[userId] && this.userHelper[userId].selectedNames || []
    };
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

  private setNamesToHelperByProjectIds(ids, userId) {
    if (this.userHelper[userId]) {
      this.userHelper[userId].selectedNames = this.getCommonProjectNamesByIds(ids, this.projectList);
    }
  }
}

