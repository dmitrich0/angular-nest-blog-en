import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./services/auth-service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';

  constructor(private router: Router, private authService: AuthService) {
  }

  navigateTo(value:  string) {
    this.router.navigate(['../', value]);
  }

  logout() {
    this.authService.logout();
  }
}
