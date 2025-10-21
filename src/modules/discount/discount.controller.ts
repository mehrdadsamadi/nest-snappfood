import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { SwaggerConsumes } from '../../common/enum/swagger-consumes.enum';
import { DiscountDto } from './dto/discount.dto';

@Controller('discount')
@ApiTags('Discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() discountDto: DiscountDto) {
    return this.discountService.create(discountDto);
  }

  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.discountService.delete(id);
  }
}
