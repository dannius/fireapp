import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class CreateProjectDialogComponent implements OnInit {

  public form: FormGroup;
  public isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<CreateProjectDialogComponent>,
    private builder: FormBuilder
  ) { }

  ngOnInit() {
    this.form = this.builder.group({
      name: [null, Validators.required],
    });
  }

  public onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      console.log('create');
    }
  }

  public close() {
    this.dialogRef.close();
  }

}
