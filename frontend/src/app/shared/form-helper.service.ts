import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class FormHelperService {

  public markAllFieldsAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

  public markAllFieldsAsUntouched(form: FormGroup) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.get(field);
      control.markAsUntouched({ onlySelf: true });
    });
  }
}
