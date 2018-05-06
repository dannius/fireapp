import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Project } from '@app/core/models';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './dialog.component.html'
})
export class InputDialogComponent implements OnInit {

  public form: FormGroup;
  public isLoading = false;
  public btnTitle: any;

  constructor(
    public dialogRef: MatDialogRef<InputDialogComponent>,
    private builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.btnTitle = {
      confirm: this.data.btnConfirm || 'Ок',
      close: this.data.btnClose || 'Отмена'
    };

    this.form = this.builder.group({
      name: [null, Validators.required],
    });

    this.form.get('name')
    .valueChanges
    .subscribe(() => {
      if (this.form.get('name').errors && !this.form.get('name').errors.required) {
        this.form.get('name').setErrors(null);
      }
    });
  }

  public onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.data.onSubmit(this);
  }

  public close() {
    this.dialogRef.close();
  }

}
