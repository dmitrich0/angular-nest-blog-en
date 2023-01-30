import {Body, Controller, Get, Post, Query, Request, UseGuards} from '@nestjs/common';
import {BlogService} from "./blog.service";
import {Observable} from "rxjs";
import {IBlogEntry} from "../../models/blog-entry.interface";
import {JwtAuthGuard} from "../../guards/jwt-guard";

@Controller('blogs')
export class BlogController {
  constructor(
    private blogService: BlogService
  ) {
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() blogEntry: IBlogEntry, @Request() req): Observable<IBlogEntry> {
    const user = req.user.user
    return this.blogService.create(user, blogEntry);
  }
  
  @Get()
  find(@Query('userId') userId: number): Observable<IBlogEntry[]> {
    if (!userId) {
      return this.blogService.findAll();
    } else {
      return this.blogService.findByUserId(userId);
    }
  }
}
