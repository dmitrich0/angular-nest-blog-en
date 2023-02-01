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

export interface IMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface ILinks {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface IBlogEntriesPagable {
  items: IBlogEntry[];
  meta: IMeta;
  links: ILinks;
}
