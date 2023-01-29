import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BlogEntryEntity} from "../../models/blog-entry.entity";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntryEntity]),
    AuthModule,
    UserModule
  ],
  controllers: [],
  providers: []
})
export class BlogModule {
}
