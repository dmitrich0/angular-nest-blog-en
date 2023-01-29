import {IUser} from "./user.interface";

export interface IBlogEntry {
  id?: number;
  title?: string;
  slug?: string;
  description?: string;
  body?: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  author?: IUser;
  headerImage?: string;
  isPublished?: boolean;
}