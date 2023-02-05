import {Component, Inject} from '@angular/core';
import {map, Observable, switchMap, tap} from "rxjs";
import {ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../../services/user-service/user.service";
import {IUser} from "../../../models/user.interface";
import {IBlogEntriesPagable} from "../../../models/blog-entry.interface";
import {BlogService} from "../../../services/blog-service/blog.service";
import {PageEvent} from "@angular/material/paginator";
import {WINDOW} from "../../../window-token";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {

  origin = this.window.location.origin;

  private userId$: Observable<number> = this.activatedRoute.params.pipe(
    map((params: Params) => parseInt(params['id']))
  );

  user$: Observable<IUser> = this.userId$.pipe(
    switchMap((userId: number) => this.userService.findOne(userId))
  )

  blogEntries$: Observable<IBlogEntriesPagable> = this.userId$.pipe(
    switchMap((userId: number) => this.blogService.indexByUser(userId, 1, 10))
  )

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private blogService: BlogService,
    @Inject(WINDOW) private window: Window
  ) {
  }

  onPaginateChange(e: PageEvent) {
    return this.userId$.pipe(
      tap((userId: number) =>
        this.blogEntries$ = this.blogService.indexByUser(userId, e.pageIndex, e.pageSize))
    ).subscribe();
  }
}
