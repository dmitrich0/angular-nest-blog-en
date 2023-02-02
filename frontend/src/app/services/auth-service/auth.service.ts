import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, of, switchMap, tap} from "rxjs";
import {JwtHelperService} from "@auth0/angular-jwt";
import {IUser} from "../../models/user.interface";

export interface LoginForm {
  email: string;
  password: string;
}

export const JWT_NAME = 'blog-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient, private jwtHelper: JwtHelperService) {
  }

  login(loginForm: LoginForm) {
    return this.httpClient.post<any>('/api/users/login',
      {email: loginForm.email, password: loginForm.password}).pipe(
      map((token) => {
        localStorage.setItem(JWT_NAME, token.access_token);
        return token;
      })
    );
  }

  logout() {
    localStorage.removeItem(JWT_NAME);
  }

  register(user: IUser) {
    return this.httpClient.post<any>('/api/users', user).pipe(
      tap(user => console.log(user)),
      map(user => user)
    )
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(JWT_NAME);
    if (token)
      return !this.jwtHelper.isTokenExpired(token);
    else
      return false;
  }

  getUserId(): Observable<number> {
    const token: string | null = localStorage.getItem(JWT_NAME);
    return of(token).pipe(
      // @ts-ignore
      switchMap((token: string) => of(this.jwtHelper.decodeToken(token)).pipe(
        // @ts-ignore
        map((tokenData => Number(tokenData.user.id)))
      ))
    )
  }
}
