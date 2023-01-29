import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../models/user.entity";
import {Like, Repository} from "typeorm";
import {IUser, UserRole} from "../../models/user.interface";
import {catchError, from, map, Observable, switchMap, tap, throwError} from "rxjs";
import {AuthService} from "../auth/auth.service";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) {
    }

    create(user: IUser): Observable<IUser> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = UserRole.USER;
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: IUser) => {
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError(err => throwError(err))
                );
            })
        )
    }

    findOne(id: number): Observable<IUser> {
        return from(this.userRepository.findOneBy({id})).pipe(
            map((user: IUser) => {
                const {password, ...result} = user;
                return result;
            })
        );
    }

    findAll(): Observable<IUser[]> {
        return from(this.userRepository.find()).pipe(
            map((users) => {
                users.forEach(user => {
                    delete user.password;
                });
                return users;
            })
        );
    }

    paginate(options: IPaginationOptions): Observable<Pagination<IUser>> {
        return from(paginate<IUser>(this.userRepository, options)).pipe(
            map((usersPagable: Pagination<IUser>) => {
                usersPagable.items.forEach(user => {
                    delete user.password;
                });
                return usersPagable;
            })
        )
    }

    paginateFilterByUsername(options: IPaginationOptions, user: IUser): Observable<Pagination<IUser>>{
        return from(this.userRepository.findAndCount({
            skip: (Number(options.page) - 1) * Number(options.limit) || 0,
            take: Number(options.limit) || 10,
            order: {id: "ASC"},
            select: ['id', 'name', 'username', 'email', 'role'],
            where: [
                { username: Like(`%${user.username}%`)}
            ]
        })).pipe(
            map(([users, totalUsers]) => {
                const usersPageable: Pagination<IUser> = {
                    items: users,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + ``,
                        next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                        last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.limit))}`
                    },
                    meta: {
                        currentPage: Number(options.page),
                        itemCount: users.length,
                        itemsPerPage: Number(options.limit),
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / Number(options.limit))
                    }
                };
                return usersPageable;
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: IUser): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;
        return from(this.userRepository.update(id, user)).pipe(
          switchMap(() => this.findOne(id))
        );
    }

    login(user: IUser): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: IUser) => {
                if (user) {
                    return this.authService.generateJwt(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong credentials';
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<IUser> {
        return this.findByMail(email).pipe(
            switchMap((user: IUser) =>
                this.authService.comparePasswords(password, user.password).pipe(
                    map((match: boolean) => {
                        if (match) {
                            const {password, ...result} = user;
                            return result;
                        } else {
                            throw Error();
                        }
                    })
                ))
        )
    }

    findByMail(email: string): Observable<IUser> {
        return from(this.userRepository.findOneBy({email}));
    }

    updateRoleOfUser(id: number, user: IUser): Observable<any> {
        return from(this.userRepository.update(id, user));
    }

}
