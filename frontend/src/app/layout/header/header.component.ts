import { AuthService } from '@app/core/auth';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  @Output()
  public toggleSidenav = new EventEmitter<void>();

  public login: String;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.login = user ? user && user.name ||
                    user && user.email.substring(0, user.email.indexOf('@')) : '';
    });
  }

  public logout(): void {
    this.authService.logout();
  }
}
