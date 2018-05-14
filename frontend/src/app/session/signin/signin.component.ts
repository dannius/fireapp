import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/auth';
import { DemoSdkService } from '@app/demo-sdk.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent implements OnInit {

  public form: FormGroup;
  public invalidForm: Boolean = false;
  public isLoading: Boolean = false;

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    // only for tests, remove later
    private sdkService: DemoSdkService
  ) {}

  public ngOnInit() {
    this.sdkService.setup('X8D0nYyGl/IEQFL8cpCR0apuKuORNfql', 'dino_test');

    this.form = this.builder.group ({
      email: [null , Validators.compose ( [ Validators.required, Validators.email ] )],
      password: [null , Validators.compose ( [ Validators.required ] )]
    });
  }

  public onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    const { email, password } = this.form.value;

    this.authService.login(email, password)
    .subscribe((user) => {
      this.sdkService.createError('Test error when user login');

      this.router.navigate(['/']);
      this.isLoading = false;
    }, (error) => {
      this.invalidForm = true;
      this.isLoading = false;
    });
  }

}
