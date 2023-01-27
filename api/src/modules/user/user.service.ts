import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../models/user.entity";
import {Like, Repository} from "typeorm";
import {User, UserRole} from "../../models/user.interface";
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

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = UserRole.USER;
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError(err => throwError(err))
                );
            })
        )
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOneBy({id})).pipe(
            map((user: User) => {
                const {password, ...result} = user;
                return result;
            })
        );
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users) => {
                users.forEach(user => {
                    delete user.password;
                });
                return users;
            })
        );
    }

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPagable: Pagination<User>) => {
                usersPagable.items.forEach(user => {
                    delete user.password;
                });
                return usersPagable;
            })
        )
    }

    paginateFilterByUsername(options: IPaginationOptions, user: User): Observable<Pagination<User>>{
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
                const usersPageable: Pagination<User> = {
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

    updateOne(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;
        return from(this.userRepository.update(id, user)).pipe(
          switchMap(() => this.findOne(id))
        );
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateJwt(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong credentials';
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByMail(email).pipe(
            switchMap((user: User) =>
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

    findByMail(email: string): Observable<User> {
        return from(this.userRepository.findOneBy({email}));
    }

    updateRoleOfUser(id: number, user: User): Observable<any> {
        return from(this.userRepository.update(id, user));
    }

}
