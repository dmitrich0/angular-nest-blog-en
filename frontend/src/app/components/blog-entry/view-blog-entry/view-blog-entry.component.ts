import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {BlogService} from "../../../services/blog-service/blog.service";
import {map, Observable, switchMap} from "rxjs";
import {IBlogEntry} from "../../../models/blog-entry.interface";

@Component({
  selector: 'app-view-blog-entry',
  templateUrl: './view-blog-entry.component.html',
  styleUrls: ['./view-blog-entry.component.scss']
})
export class ViewBlogEntryComponent implements OnInit {
  blogEntry$: Observable<IBlogEntry> = this.activatedRoute.params.pipe(
    switchMap((params: Params) => {
      const blogEntryId: number = parseInt(params['id']);
      return this.blogService.findOne(blogEntryId).pipe(
        map((blogEntry: IBlogEntry) => blogEntry)
      );
    })
  )

  constructor(
    private activatedRoute: ActivatedRoute,
    private blogService: BlogService
  ) {
  }

  ngOnInit(): void {
  }
}
