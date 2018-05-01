import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth';
import { PasswordValidation } from '@app/shared';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {

  public form: FormGroup;
  public invalidForm: Boolean = false;
  public isLoading: Boolean = false;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {}

  public ngOnInit() {
    this.form = this.builder.group ({
      email: [null , Validators.compose ( [ Validators.required, Validators.email ] )],
      password: [null , Validators.compose ( [ Validators.required, Validators.minLength(6) ] )],
      passwordConfirmation: [null , Validators.compose ( [ Validators.required ] )],
    }, {
      validator: PasswordValidation.MatchPassword
    });
  }

  public onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.invalidForm = false;
    this.isLoading = true;
    const { email, password } = this.form.value;

    this.authService.signup(email, password)
    .subscribe((user) => {
      this.router.navigate(['/']);
      this.isLoading = false;
    }, (error) => {
      this.invalidForm = true;
      this.isLoading = false;
    });
  }

}
