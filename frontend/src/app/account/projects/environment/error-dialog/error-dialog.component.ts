import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorService } from '@app/account/projects/error.service';
import { User } from '@app/core/models';
import { Error } from '@app/core/models/error';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html'
})
export class ErrorDialogComponent implements OnInit {

  public error: Error;
  public users: User[];

  public editMode = false;
  public form: FormGroup;

  public unchangedDataError = false;

  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    private builder: FormBuilder,
    private errorService: ErrorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.error = this.data.error;
    this.users = this.data.users;

    this.form = this.builder.group({
      userId: [this.error.user && this.error.user.id || null],
      description: [this.error.description]
    });

    this.form.get('description')
      .valueChanges
      .subscribe(() => {
        if (this.unchangedDataError) {
          this.unchangedDataError = false;
        }
      });

    this.form.get('userId')
      .valueChanges
      .subscribe(() => {
        if (this.unchangedDataError) {
          this.unchangedDataError = false;
        }
      });
  }

  public close() {
    this.dialogRef.close();
  }

  public update() {
    if (this.form.value.description === this.error.description &&
    this.error.user && this.form.value.userId === this.error.user.id) {
      this.unchangedDataError = true;
      return;
    }

    this.errorService.update(this.error.id, this.form.value)
    .subscribe((error) => {
      this.dialogRef.close(error);
    });
  }

  public toggleEditMode() {
    this.editMode = !this.editMode;

    if (!this.editMode) {
      this.form.get('description').setValue('');
    }
  }

}
