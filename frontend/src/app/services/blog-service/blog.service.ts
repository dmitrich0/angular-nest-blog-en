import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {IBlogEntriesPagable} from "../../models/blog-entry.interface";

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private httpClient: HttpClient) {
  }

  indexAll(page: number, limit: number): Observable<IBlogEntriesPagable> {
    return this.httpClient.get<IBlogEntriesPagable>(`/api/blog-entries?page=${page}&limit=${limit}`);
  }
}
