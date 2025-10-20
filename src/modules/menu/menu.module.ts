import { Module } from '@nestjs/common';
import { MenuService } from './services/menu.service';
import { MenuController } from './controllers/menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from './entities/menu.entity';
import { MenuTypeEntity } from './entities/type.entity';
import { MenuFeedbackEntity } from './entities/feedback.entity';
import { MenuTypeController } from './controllers/type.controller';
import { MenuFeedbackController } from './controllers/feedback.controller';
import { MenuTypeService } from './services/type.service';
import { MenuFeedbackService } from './services/feedback.service';
import { SupplierModule } from '../supplier/supplier.module';

@Module({
  imports: [
    SupplierModule,
    TypeOrmModule.forFeature([MenuEntity, MenuTypeEntity, MenuFeedbackEntity]),
  ],
  controllers: [MenuController, MenuTypeController, MenuFeedbackController],
  providers: [MenuService, MenuTypeService, MenuFeedbackService],
})
export class MenuModule {}
