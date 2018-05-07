import { Component, Input, OnInit } from '@angular/core';
import { ProjectWithUsers } from '@app/core/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { PubSubService } from '@app/core/pub-sub.service';
import { ProjectService } from '@app/account/projects/project.service';

@Component({
  selector: 'app-project-update',
  templateUrl: './project-update.component.html'
})
export class ProjectUpdateComponent implements OnInit {

  @Input()
  public project: ProjectWithUsers;

  public form: FormGroup;
  public isLoading: boolean;

  private snackBarConfig = {
    duration: 3000
  };

  constructor(
    private builder: FormBuilder,
    private projectService: ProjectService,
    private pubSubService: PubSubService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = this.builder.group({
      name: [this.project.name, Validators.required]
    });
  }

  public updateInfo() {
    this.form.markAsTouched();
    if (this.form.controls.name.value === this.project.name) {
      return;
    }

    this.isLoading = true;

    this
      .projectService
      .update(this.project.id, this.form.value)
      .subscribe((project) => {
        if (project) {
          this.pubSubService.setProject(project);
          this.snackBar.open('Информация обновлена', '', this.snackBarConfig);
        } else {
          this.snackBar.open('Уже есть проект с таким названием, придумайте другое', '', this.snackBarConfig);
        }

        this.form.markAsUntouched();
        this.isLoading = false;
      });
  }

}
