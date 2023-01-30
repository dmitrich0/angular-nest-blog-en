import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import {UserService} from "./user.service";
import {IUser, UserRole} from "../../models/user.interface";
import {catchError, map, Observable, of} from "rxjs";
import {hasRoles} from "../../decorators/roles.decorator";
import {JwtAuthGuard} from "../../guards/jwt-guard";
import {RolesGuard} from "../../guards/roles.guard";
import {Pagination} from "nestjs-typeorm-paginate";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {v4 as uuidv4} from 'uuid';
import {join} from "path";
import {UserIsUserGuard} from "../../guards/userIsUser.guard";

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
  create(@Body() user: IUser): Observable<IUser | Object> {
    return this.userService.create(user).pipe(
      map((user: IUser) => user),
      catchError(err => of({error: err.message}))
    );
  }

  @Post('login')
  login(@Body() user: IUser): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return {access_token: jwt};
      })
    )
  }

  @Get(':id')
  findOne(@Param() params): Observable<IUser> {
    return this.userService.findOne(params.id);
  }

  @Get()
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('username') username: string
  ): Observable<Pagination<IUser>> {
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @hasRoles(UserRole.ADMIN)
  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<IUser> {
    return this.userService.deleteOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: IUser): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id') id: string, @Body() user: IUser): Observable<IUser> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
    const user: IUser = req.user;
    return this.userService.updateOne(user.id, {profileImage: file.filename}).pipe(
      map((user: IUser) => ({
        profileImage: user.profileImage
      }))
    );
  }

  @Get('profile-image/:imagename')
  getProfileImage(@Param('imagename') imageName, @Res() res): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), 'uploads/profile-images/', imageName)));
  }

}
