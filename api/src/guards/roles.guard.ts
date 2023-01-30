import {CanActivate, ExecutionContext, forwardRef, Inject, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {UserService} from "../modules/user/user.service";
import {map, Observable} from "rxjs";
import {IUser} from "../models/user.interface";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        @Inject(forwardRef(() => UserService))
        private userService: UserService
    ) {
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user: IUser = request.user;

        return this.userService.findOne(user.id).pipe(
            map((user: IUser) => {
                const hasRole = () => roles.indexOf(user.role) > -1;
                let hasPermission: boolean = false;
                if (hasRole()) {
                    hasPermission = true;
                }
                return user && hasPermission;
            })
        )
    }
}