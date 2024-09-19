import { IBase } from './base.interface';
import { IPagination } from './pagination.interface';

export interface IUser extends IBase {
  readonly email?: string;
  readonly password?: string;
}

export interface IUsers extends IPagination {
  data: IUser[];
}


