import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  login(email: string, password: string) {
    return this.httpClient.post<any>('/api/users/login', {email, password}).pipe(
      map((token) => {
        localStorage.setItem('blog-token', token.access_token);
        return token;
      })
    );
  }
}
