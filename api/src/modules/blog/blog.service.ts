import {Injectable} from '@nestjs/common';
import {from, Observable, of, switchMap} from "rxjs";
import {IBlogEntry} from "../../models/blog-entry.interface";
import {IUser} from "../../models/user.interface";
import {InjectRepository} from "@nestjs/typeorm";
import {BlogEntryEntity} from "../../models/blog-entry.entity";
import {Repository} from "typeorm";
import {UserService} from "../user/user.service";
import slugify from "slugify";

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntryEntity) private readonly blogRepository: Repository<BlogEntryEntity>,
    private userService: UserService
  ) {
  }

  create(user: IUser, blogEntry: IBlogEntry): Observable<IBlogEntry> {
    blogEntry.author = user;
    return this.generateSlug(blogEntry.title).pipe(
      switchMap((slug: string) => {
        blogEntry.slug = slug;
        return from(this.blogRepository.save(blogEntry));
      })
    )
  }

  findAll(): Observable<IBlogEntry[]> {
    return from(this.blogRepository.find({
      relations: ['author'],
    }));
  }

  findByUserId(userId: number): Observable<IBlogEntry[]> {
    return from(this.blogRepository.find({
      where: {
        author: {id: userId}
      },
      relations: ['author'],
    }))
  }

  findOneById(id: number): Observable<IBlogEntry> {
    return from(this.blogRepository.findOne({
      where: {
        id: id
      },
      relations: ['author'],
    }))
  }

  updateOne(id: number, blogEntry: IBlogEntry): Observable<IBlogEntry> {
    return from(this.blogRepository.update(id, blogEntry)).pipe(
      switchMap(() => this.findOneById(id))
    )
  }
  
  deleteOne(id: number): Observable<any> {
    return from(this.blogRepository.delete(id));
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }
}
