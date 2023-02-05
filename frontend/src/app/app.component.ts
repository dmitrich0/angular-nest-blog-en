import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./services/auth-service/auth.service";
import {from, Observable, of, Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  authed: Observable<boolean> = of(this.authService.isAuthenticated());

  constructor(private router: Router, private authService: AuthService) {
  }

  navigateTo(value:  string) {
    this.router.navigate(['../', value]);
  }

  logout() {
    this.authService.logout();
  }
}
