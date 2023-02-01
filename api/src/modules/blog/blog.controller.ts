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
import {BlogService} from "./blog.service";
import {Observable, of} from "rxjs";
import {IBlogEntry} from "../../models/blog-entry.interface";
import {JwtAuthGuard} from "../../guards/jwt-guard";
import {UserIsAuthorGuard} from "../../guards/userIsAuthor.guard";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {v4 as uuidv4} from 'uuid';
import {IImage} from "../../models/IImage.interface";
import {join} from "path";

const path = require('node:path');

export const storage = {
  storage: diskStorage({
    destination: './uploads/blog-entry-images',
    filename: (req, file, callback) => {
      const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      callback(null, `${filename}${extension}`)
    }
  })
}

@Controller('blog-entries')
export class BlogController {
  constructor(
    private blogService: BlogService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blogEntry: IBlogEntry, @Request() req): Observable<IBlogEntry> {
    const user = req.user;
    return this.blogService.create(user, blogEntry);
  }

  // @Get()
  // find(@Query('userId') userId: number): Observable<IBlogEntry[]> {
  //   if (!userId) {
  //     return this.blogService.findAll();
  //   } else {
  //     return this.blogService.findByUserId(userId);
  //   }
  // }
  @Get()
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.blogService.paginateAll({
      limit: limit,
      page: page,
      route: 'http://localhost:3000/api/blog-entries'
    });
  }

  @Get('user/:user')
  indexByUser(
    @Param('user') userId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.blogService.paginateByUser({
      limit: limit,
      page: page,
      route: 'http://localhost:3000/api/blog-entries'
    }, userId);
  }

  @Get(':id')
  findOneById(@Param('id') id: number): Observable<IBlogEntry> {
    return this.blogService.findOneById(id);
  }

  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Put(':id')
  updateOne(@Param('id') id: number, @Body() blogEntry: IBlogEntry): Observable<IBlogEntry> {
    return this.blogService.updateOne(id, blogEntry);
  }

  @UseGuards(JwtAuthGuard, UserIsAuthorGuard)
  @Delete(':id')
  deleteOne(@Param('id') id: number): Observable<any> {
    return this.blogService.deleteOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('image/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  uploadFile(@UploadedFile() file, @Request() req): Observable<IImage> {
    return of(file);
  }

  @Get('image/:imagename')
  findImage(@Param('imagename') imagename, @Res() res): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), 'uploads/blog-entry-images/', imagename)));
  }
}
