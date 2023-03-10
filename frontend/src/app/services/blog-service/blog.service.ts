import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {IBlogEntriesPagable, IBlogEntry} from "../../models/blog-entry.interface";

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private httpClient: HttpClient) {
  }

  findOne(id: number): Observable<IBlogEntry> {
    return this.httpClient.get<IBlogEntry>(`/api/blog-entries/${id}`);
  }

  indexAll(page: number, limit: number): Observable<IBlogEntriesPagable> {
    return this.httpClient.get<IBlogEntriesPagable>(`/api/blog-entries?page=${page}&limit=${limit}`);
  }

  indexByUser(userId: number, page: number, limit: number): Observable<IBlogEntriesPagable> {
    return this.httpClient.get<IBlogEntriesPagable>(`/api/blog-entries/user/${userId}?page=${page}&limit=${limit}`);
  }

  post(blogEntry: IBlogEntry): Observable<IBlogEntry> {
    return this.httpClient.post<IBlogEntry>('/api/blog-entries', blogEntry);
  }

  uploadHeaderImage(formData: FormData): Observable<any> {
    return this.httpClient.post<FormData>('/api/blog-entries/image/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
