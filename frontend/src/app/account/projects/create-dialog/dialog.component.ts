import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '@app/account/projects/project.service';
import { Project } from '@app/core/models';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class CreateProjectDialogComponent implements OnInit {

  public form: FormGroup;
  public isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
    private builder: FormBuilder,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.form = this.builder.group({
      name: [null, Validators.required],
    });

    this.form.get('name')
    .valueChanges
    .subscribe(() => {
      if (this.form.get('name').errors &&
            this.form.get('name').errors.alreadyExist) {
        this.form.get('name').setErrors({ alreadyExist: false });
      }
    });
  }

  public onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    this.projectService
    .create(this.form.value.name)
    .subscribe((project: Project | number) => {
      this.isLoading = false;

      if (project === 422) {
        this.form.get('name').setErrors({ alreadyExist: true });
      } else {
        this.dialogRef.close();
      }
    });
  }

  public close() {
    this.dialogRef.close();
  }

}
