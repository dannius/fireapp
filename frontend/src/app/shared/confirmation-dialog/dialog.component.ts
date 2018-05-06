import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html'
})
export class ConfirmationDialogComponent implements OnInit {

  public btnTitle: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.btnTitle = {
      confirm: this.data.btnConfirm || 'Ок',
      close: this.data.btnClose || 'Отмена'
    };
  }

}
