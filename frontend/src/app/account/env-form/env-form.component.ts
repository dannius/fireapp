import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Project } from '@app/core/models';
import { EnvironmentService } from '@app/account/environment.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormHelperService } from '@app/shared';
import { PubSubService } from '@app/core/pub-sub.service';

@Component({
  selector: 'app-env-form',
  templateUrl: './env-form.component.html'
})
export class EnvFormComponent implements OnInit {

  @Input()
  public project: Project;

  public envForm: FormGroup;
  public showCreateForm = new BehaviorSubject<Boolean>(false);

  constructor(
    private builder: FormBuilder,
    private envService: EnvironmentService,
    private formHelperService: FormHelperService,
    private pubSubService: PubSubService
  ) { }

  ngOnInit() {
    this.envForm = this.builder.group({
      name: ['', Validators.required]
    });

    this.showCreateForm
      .subscribe((show) => {
        if (!show) {
          this.envForm.get('name').setValue('');
          this.formHelperService.markAllFieldsAsUntouched(this.envForm);
        }
      });
  }

  public createEnv() {
    if (this.envForm.invalid) {
      return;
    }

    const params = {
      ...{
        projectId: this.project.id
      },
      ...this.envForm.value
    };

    this.envService.create(params)
    .subscribe((env) => {
      if (env) {
        this.project.environments.push(env);
        this.showCreateForm.next(false);
      } else {
        this.envForm.get('name').setErrors({ existName: true });
      }
    });
  }

}
