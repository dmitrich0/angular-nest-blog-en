import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Request, Res
} from '@nestjs/common';
import {UserService} from "./user.service";
import {User, UserRole} from "../../models/user.interface";
import {catchError, map, Observable, of} from "rxjs";
import {hasRoles} from "../../decorators/roles.decorator";
import {JwtAuthGuard} from "../../guards/jwt-guard";
import {RolesGuard} from "../../guards/roles.guard";
import {Pagination} from "nestjs-typeorm-paginate";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {v4 as uuidv4} from 'uuid';
import {join} from "path";

const path = require('node:path');

export const storage = {
  storage: diskStorage({
    destination: './uploads/profile-images',
    filename: (req, file, callback) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      callback(null, `${filename}${extension}`)
    }
  })
}


@Controller('users')
export class UserController {
  constructor(private userService: UserService) {
  }

  @Post()
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError(err => of({error: err.message}))
    );
  }

  @Post('login')
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return {access_token: jwt};
      })
    )
  }

  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id);
  }

  @Get()
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('username') username: string
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    if (username === null || username === undefined) {
      return this.userService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/api/users'
      });
    }
    return this.userService.paginateFilterByUsername({
      page: Number(page),
      limit: Number(limit),
      route: 'http://localhost:3000/api/users'
    }, {username})
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<User> {
    return this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
    const user: User = req.user.user;
    return this.userService.updateOne(user.id, {profileImage: file.filename}).pipe(
      map((user: User) => ({
        profileImage: user.profileImage
      }))
    );
  }
  
  @Get('profile-image/:imagename')
  getProfileImage(@Param('imagename') imageName, @Res() res): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), 'uploads/profile-images/', imageName)));
  }
  
}
