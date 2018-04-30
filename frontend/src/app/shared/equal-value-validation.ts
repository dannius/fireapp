import { AbstractControl, FormGroup } from '@angular/forms';

export class EqualValueValidation {

  public static equal(targetKey: string, toMatchKey: string) {
    return (group: FormGroup) => {
      const target = group.get(targetKey);
      const nonEqual = group.get(toMatchKey);

      if (target.touched && nonEqual.touched) {
        const isMatch = target.value === nonEqual.value;

        if (isMatch && target.valid && nonEqual.valid) {
          target.setErrors({equal: toMatchKey});
          return null;
        }
        if (!isMatch && target.hasError('equal')) {
          target.setErrors(null);
        }
      }

      return null;
    };
  }
}
