import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-show',
  templateUrl: './show.component.html'
})
export class ProjectShowComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
   const id = this.route.snapshot.data.id;
  }

}
