import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { UserService } from '@app/account/user.service';
import { AuthService } from '@app/core/auth';
import { User } from '@app/core/models';


@Component({
  selector: 'app-info-update-card',
  templateUrl: './info-update.component.html'
})
export class InfoUpdateComponent implements OnInit {

  public form: FormGroup;
  public isLoading: boolean;
  public user: User;

  private config = {
    duration: 2000
  };

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.user = user || User.empty();

      this.form = this.builder.group({
        name: [this.user.name, Validators.required]
      });
    });
  }

  public updateInfo() {
    this.form.markAsTouched();
    if (this.form.controls.name.value === this.user.name) {
      return;
    }

    this.isLoading = true;

    this
      .userService
      .updateAttributes(this.user.id, this.form.value)
      .subscribe((user) => {
        if (user) {
          this.authService.setUser(user);
          this.snackBar.open('Информация обновлена', '', this.config);
        } else {
          this.snackBar.open('Что то пошло не так', '', this.config);
        }

        this.form.markAsUntouched();
        this.isLoading = false;
      });
  }
}
