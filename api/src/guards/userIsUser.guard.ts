import {CanActivate, ExecutionContext, forwardRef, Inject} from "@nestjs/common";
import {map, Observable} from "rxjs";
import {UserService} from "../modules/user/user.service";
import {IUser} from "../models/user.interface";

export class UserIsUserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService
  ) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const user: IUser = request.user;
    return this.userService.findOne(user.id).pipe(
      map((user: IUser) => {
        let hasPermission = false;
        if (user.id === Number(params.id)) {
          hasPermission = true;
        }
        return user && hasPermission;
      })
    );
  }
}