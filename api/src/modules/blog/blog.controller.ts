import {Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards} from '@nestjs/common';
import {BlogService} from "./blog.service";
import {Observable} from "rxjs";
import {IBlogEntry} from "../../models/blog-entry.interface";
import {JwtAuthGuard} from "../../guards/jwt-guard";
import {UserIsAuthorGuard} from "../../guards/userIsAuthor.guard";

@Controller('blogs')
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
  
  @Get()
  find(@Query('userId') userId: number): Observable<IBlogEntry[]> {
    if (!userId) {
      return this.blogService.findAll();
    } else {
      return this.blogService.findByUserId(userId);
    }
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
}
