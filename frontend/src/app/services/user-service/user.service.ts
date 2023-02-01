import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, throwError} from "rxjs";
import {IUser} from "../../models/user.interface";

export interface UserData {
  items: IUser[],
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

  findOne(id: number): Observable<IUser> {
    return this.httpClient.get('/api/users/' + id).pipe(
      map((user: IUser) => user)
    );
  }

  updateOne(user: IUser): Observable<IUser> {
    return this.httpClient.put('api/users/' + user.id, user);
  }

  findAll(page: number, size: number): Observable<UserData> {
    return this.httpClient.get(`/api/users?page=${page}&limit=${size}`).pipe(
      // @ts-ignore
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.httpClient.post<FormData>('/api/users/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  paginateByName(page: number, size: number, username: string): Observable<UserData> {
    return this.httpClient.get(`/api/users?page=${page}&limit=${size}&username=${username}`).pipe(
      // @ts-ignore
      map((userData: UserData) => userData),
      catchError(err => throwError(err))
    )
  }
}
