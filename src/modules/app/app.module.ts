import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfig } from '../../config/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), '.env'),
    }),
  ],
  TypeOrmModule.forRoot(TypeOrmConfig()),
  controllers: [],
  providers: [],
})
export class AppModule {}
