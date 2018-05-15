import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { UserService } from '@app/account/user.service';
import { AuthService } from '@app/core/auth';
import { User, Project } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';


@Component({
  selector: 'app-info-update-card',
  templateUrl: './info-update.component.html'
})
export class InfoUpdateComponent implements OnInit {

  public form: FormGroup;
  public isLoading: boolean;
  public user: User;

  private currentProject: Project;

  private snackBarConfig = {
    duration: 2000
  };

  constructor(
    private builder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private pubSubService: PubSubService
  ) { }

  ngOnInit() {
    this.pubSubService
      .project
      .subscribe((p) => {
        this.currentProject = p;
      });

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
      .update(this.user.id, this.form.value)
      .subscribe((user) => {
        if (user) {
          this.authService.setUser(user);

          if (this.currentProject) {
            this.currentProject.users = this.currentProject.users.map((u) => u.id === user.id ? user : u);
          }

          this.snackBar.open('Информация обновлена', '', this.snackBarConfig);
        } else {
          this.snackBar.open('Что то пошло не так', '', this.snackBarConfig);
        }

        this.form.markAsUntouched();
        this.isLoading = false;
      });
  }
}
