import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {User} from "../auth-service/auth.service";

export interface UserData {
  items: User[],
  meta: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number,
  },
  links: {
    first: string,
    previous: string,
    next: string,
    last: string,
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {

  }

  findAll(page: number, size: number): Observable<UserData> {
    return this.httpClient.get(`/api/users?page=${page}&limit=${size}`).pipe(
      // @ts-ignore
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )
  }
}
