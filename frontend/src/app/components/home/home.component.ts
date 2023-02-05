import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {IBlogEntriesPagable} from "../../models/blog-entry.interface";
import {BlogService} from "../../services/blog-service/blog.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  blogEntries$: Observable<IBlogEntriesPagable> = this.blogService.indexAll(1, 10);

  constructor(private blogService: BlogService) {
  }

  onPaginateChange(event: PageEvent) {
    this.blogEntries$ = this.blogService.indexAll(event.pageIndex, event.pageSize);
  }
}
