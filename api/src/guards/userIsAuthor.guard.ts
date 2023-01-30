import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {map, Observable, switchMap, tap} from "rxjs";
import {UserService} from "../modules/user/user.service";
import {BlogService} from "../modules/blog/blog.service";
import {IUser} from "../models/user.interface";
import {IBlogEntry} from "../models/blog-entry.interface";

@Injectable()
export class UserIsAuthorGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private blogService: BlogService
  ) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const blogEntryId: number = Number(params.id);
    const user: IUser = request.user;
    return this.userService.findOne(user.id).pipe(
      switchMap((user: IUser) => this.blogService.findOneById(blogEntryId).pipe(
        map((blogEntry: IBlogEntry) => {
          let hasPermission = false;
          if (blogEntry.author.id === Number(user.id)) {
            hasPermission = true;
          }
          return user && hasPermission;
        })
      ))
    )
  }
}