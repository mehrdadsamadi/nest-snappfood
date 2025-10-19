import { Module } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { SupplierController } from './supplier.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupplierEntity } from './entities/supplier.entity';
import { SupplierOtpEntity } from './entities/otp.entity';
import { CategoryService } from '../category/category.service';
import { JwtService } from '@nestjs/jwt';
import { S3Service } from '../s3/s3.service';
import { CategoryEntity } from '../category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SupplierEntity,
      SupplierOtpEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [SupplierController],
  providers: [SupplierService, S3Service, CategoryService, JwtService],
})
export class SupplierModule {}
