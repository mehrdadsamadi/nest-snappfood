import { UserEntity } from '../../modules/user/entity/user.entity';
import { SupplierEntity } from '../../modules/supplier/entities/supplier.entity';

declare global {
  namespace Express {
    interface Request {
      user?: UserEntity | SupplierEntity;
    }
  }
}

export {};
