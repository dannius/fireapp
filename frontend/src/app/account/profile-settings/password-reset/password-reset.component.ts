import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { UserService } from '@app/account/user.service';
import { AuthService } from '@app/core/auth';
import { FormHelperService } from '@app/shared';
import { User } from '@app/core/models/user';
import { EqualValuesValidation, PasswordValidation } from '@app/shared';


@Component({
  selector: 'app-password-reset-card',
  templateUrl: './password-reset.component.html'
})
export class PasswordResetComponent implements OnInit {
  private user: User;
  public form: FormGroup;
  public isLoading: boolean;
  public isInvalidPassword: boolean;

  private config = {
    duration: 2000
  };

  constructor(
    private builder: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private formHelper: FormHelperService
  ) { }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.user = user || User.empty();
    });

    this.form = this.builder.group({
      oldPassword: [null, Validators.compose ( [ Validators.required, Validators.minLength(6) ] )],
      password: [null, Validators.compose ( [ Validators.required, Validators.minLength(6) ] )],
      passwordConfirmation: [null, Validators.required]
    }, {
      validator: Validators.compose([
        PasswordValidation.MatchPassword,
        EqualValuesValidation.equal('oldPassword', 'password')
      ])
    });

    this.form
      .get('oldPassword')
      .valueChanges.subscribe(() => this.isInvalidPassword = false);
  }

  private resetForm() {
    this.form.get('oldPassword').setValue(null);
    this.form.get('password').setValue(null);
    this.form.get('passwordConfirmation').setValue(null);

    this.form.get('oldPassword').setErrors(null);
    this.form.get('password').setErrors(null);
    this.form.get('passwordConfirmation').setErrors(null);

    this.formHelper.markAllFieldsAsUntouched(this.form);
  }

  public resetPassword() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.isInvalidPassword = false;

    this
      .userService
      .resetPassword(this.user.id, this.form.value)
      .subscribe((user) => {
        if (user) {
          this.snackBar.open('Пароль обновлен', '', this.config);
          this.resetForm();
        } else {
          this.isInvalidPassword = true;
        }

        this.isLoading = false;
      });
  }
}
