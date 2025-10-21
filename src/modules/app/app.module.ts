import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from '../../config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from '../category/category.module';
import { AuthModule } from '../auth/auth.module';
import { SupplierModule } from '../supplier/supplier.module';
import { MenuModule } from '../menu/menu.module';
import { DiscountModule } from '../discount/discount.module';
import { BasketModule } from '../basket/basket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
    TypeOrmModule.forRoot(TypeOrmConfig()),
    AuthModule,
    CategoryModule,
    SupplierModule,
    MenuModule,
    DiscountModule,
    BasketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
