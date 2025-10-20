import { IUser } from '../../modules/user/interface/user-request.interface';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
