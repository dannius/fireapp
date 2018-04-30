import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

  public static MatchPassword(abstractControl: AbstractControl) {
    const password = abstractControl.get('password').value;
    const passwordConfirmation = abstractControl.get('passwordConfirmation').value;
    if (password !== passwordConfirmation) {
      abstractControl.get('passwordConfirmation').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}

