import {Injectable} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {from, Observable, of} from "rxjs";
import {IUser} from "../../models/user.interface";

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {
    }

    generateJwt(user: IUser): Observable<string> {
        return from(this.jwtService.signAsync({user}));
    }

    hashPassword(password: string): Observable<string> {
        return from<string>(bcrypt.hash(password, 12));
    }

    comparePasswords(newPassword: string, passwordHash: string): Observable<any | boolean> {
        console.log(newPassword);
        console.log(passwordHash);
        return from(bcrypt.compare(newPassword, passwordHash));
    }
}
