import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {IBlogEntriesPagable} from "../../../models/blog-entry.interface";
import {PageEvent} from "@angular/material/paginator";
import {BlogService} from "../../../services/blog-service/blog.service";

@Component({
  selector: 'app-all-blog-entries',
  templateUrl: './all-blog-entries.component.html',
  styleUrls: ['./all-blog-entries.component.scss']
})
export class AllBlogEntriesComponent implements OnInit{
  dataSource: Observable<IBlogEntriesPagable> = this.blogService.indexAll(1, 10);
  pageEvent!: PageEvent;

  constructor(private blogService: BlogService) {
  }

  ngOnInit(): void {

  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex + 1;
    let limit = event.pageSize;
    this.dataSource = this.blogService.indexAll(page, limit);
  }
}
