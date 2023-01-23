import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  constructor(private authService: AuthService) {
  }

  login() {
    this.authService.login('hello2sdd@mail.ru', 'easyPassword')
      .subscribe(data => console.log('SUCCESS'));
  }
}
