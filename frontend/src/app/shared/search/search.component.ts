import '@app/shared/rxjs-operators';

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchFormComponent implements OnInit {

  @Input()
  public placeholder: string;

  @Output()
  public pushSubstring = new EventEmitter<any>();

  public form: FormGroup;

  constructor(private builder: FormBuilder) { }

  ngOnInit() {
    this.form = this.builder.group({
      substring: ['']
    });

    this.form
      .get('substring')
      .valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe((value) => {
        this.pushSubstring.emit(value.trim().toLowerCase());
      });
  }

}
