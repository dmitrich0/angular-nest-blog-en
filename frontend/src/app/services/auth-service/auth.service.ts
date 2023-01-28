import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, tap} from "rxjs";

export interface LoginForm {
  email: string;
  password: string;
}

export interface User {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  // passwordConfirm?: string;
  role?: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  login(loginForm: LoginForm) {
    return this.httpClient.post<any>('/api/users/login',
      {email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {
        localStorage.setItem('blog-token', token.access_token);
        return token;
      })
    );
  }

  register(user: User) {
    return this.httpClient.post<any>('/api/users', user).pipe(
      tap(user => console.log(user)),
      map(user => user)
    )
  }
}
