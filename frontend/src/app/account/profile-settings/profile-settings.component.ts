import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { UserService } from '@app/account/user.service';
import { AuthService } from '@app/core/auth';
import { FormHelperService } from '@app/core/form-helper/form-helper.service';
import { User } from '@app/core/models/user';
import { EqualValuesValidation, PasswordValidation } from '@app/shared';


@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html'
})
export class ProfileSettingsComponent implements OnInit {

  public updateForm: FormGroup;
  public resetPasswordForm: FormGroup;

  public isPasswordLoading: boolean;
  public isInfoLoading: boolean;
  public isInvalidPassword: boolean;

  public user: User;

  private config = {
    duration: 2000
  };

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private formHelper: FormHelperService
  ) { }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.user = user || User.empty();

      this.updateForm = this.builder.group({
        name: [this.user.name, Validators.required]
      });
    });

    this.resetPasswordForm = this.builder.group({
      oldPassword: [null, Validators.compose ( [ Validators.required, Validators.minLength(6) ] )],
      password: [null, Validators.compose ( [ Validators.required, Validators.minLength(6) ] )],
      passwordConfirmation: [null, Validators.required]
    }, {
      validator: Validators.compose([
        PasswordValidation.MatchPassword,
        EqualValuesValidation.equal('oldPassword', 'password')
      ])
    });

    this.resetPasswordForm
      .get('oldPassword')
      .valueChanges.subscribe(() => this.isInvalidPassword = false);
  }

  public resetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isPasswordLoading = true;
    this.isInvalidPassword = false;

    this
      .userService
      .resetPassword(this.user.id, this.resetPasswordForm.value)
      .subscribe((user) => {
        if (user) {
          this.snackBar.open('Пароль обновлен', '', this.config);
        } else {
          this.isInvalidPassword = true;
        }

        this.isPasswordLoading = false;
      });
  }

  public updateInfo() {
    this.updateForm.markAsTouched();
    if (this.updateForm.controls.name.value === this.user.name) {
      return;
    }

    this.isInfoLoading = true;

    this
      .userService
      .updateAttributes(this.user.id, this.updateForm.value)
      .subscribe((user) => {
        if (user) {
          this.authService.setUser(user);
          this.snackBar.open('Информация обновлена', '', this.config);
        } else {
          this.snackBar.open('Что то пошло не так', '', this.config);
        }

        this.updateForm.markAsUntouched();
        this.isInfoLoading = false;
      });
  }

}
