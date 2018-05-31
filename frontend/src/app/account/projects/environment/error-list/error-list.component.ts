import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from '@app/core/models';
import { PubSubService } from '@app/core/pub-sub.service';
import { Error } from '@app/core/models/error';

@Component({
  selector: 'app-error-list',
  templateUrl: './error-list.component.html'
})
export class ErrorListComponent implements OnInit {

  public solvedErrors: Error[];
  public unsolvedErrors: Error[];

  private errors: Error[];
  private project: Project;

  constructor(
    private route: ActivatedRoute,
    private pubSubService: PubSubService
  ) { }

  ngOnInit() {
    this.route.data
    .subscribe(({ env }) => {
      this.solvedErrors = [];
      this.unsolvedErrors = [];
      const [project, errors] = env;

      if (!this.project || this.project.id !== project.id) {
        this.project = project;
      }

      errors.forEach((error: Error) => {
        if (error.solved) {
          this.solvedErrors.push(error);
        } else {
          this.unsolvedErrors.push(error);
        }
      });

      this.pubSubService.setProject(this.project);
    });
  }

  public removeSolvedError(id: number) {
    let solvedError: Error;

    this.unsolvedErrors = this.unsolvedErrors.filter((error) => {
      if (error.id === id) {
        solvedError = error;
        return false;
      } else {
        return true;
      }
    });

    this.solvedErrors.push(solvedError);
  }
}
