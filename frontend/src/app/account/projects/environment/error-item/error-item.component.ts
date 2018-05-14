import { Component, OnInit, Input } from '@angular/core';
import { Project } from '@app/core/models';

@Component({
  selector: 'app-error-item',
  templateUrl: './error-item.component.html'
})
export class ErrorItemComponent implements OnInit {

  @Input()
  public error: Error;

  @Input()
  public project: Project;

  constructor() { }

  ngOnInit() {
  }

}
