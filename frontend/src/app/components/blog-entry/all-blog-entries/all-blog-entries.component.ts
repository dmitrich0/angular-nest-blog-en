import {Component, EventEmitter, Inject, Input, Output} from '@angular/core';
import {IBlogEntriesPagable} from "../../../models/blog-entry.interface";
import {PageEvent} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {WINDOW} from "../../../window-token";

@Component({
  selector: 'app-all-blog-entries',
  templateUrl: './all-blog-entries.component.html',
  styleUrls: ['./all-blog-entries.component.scss']
})
export class AllBlogEntriesComponent {
  @Input() blogEntries: IBlogEntriesPagable;
  @Output() paginate: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  pageEvent!: PageEvent;
  origin = this.window.location.origin;

  constructor(private router: Router, @Inject(WINDOW) private window: Window) {
  }

  onPaginateChange(event: PageEvent) {
    event.pageIndex++;
    this.paginate.emit(event);
  }

  navigate(id: number) {
    this.router.navigateByUrl(`blog-entries/${id}`);
  }
}
