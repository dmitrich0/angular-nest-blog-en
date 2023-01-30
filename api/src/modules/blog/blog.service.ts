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
    return from(this.blogRepository.find({relations: ['author']}));
  }

  findByUserId(userId: number): Observable<IBlogEntry[]> {
    return from(this.blogRepository.find({
      where: {
        // @ts-ignore
        author: userId
      },
      relations: ['author']
    }))
  }

  generateSlug(title: string): Observable<string> {
    return of(slugify(title));
  }
}
