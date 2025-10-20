import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MenuTypeService } from '../services/type.service';
import { SwaggerConsumes } from '../../../common/enum/swagger-consumes.enum';
import { MenuTypeDto } from '../dto/menu-type.dto';
import { SupplierAuth } from '../../../common/decorators/auth.decorator';
import { Pagination } from '../../../common/decorators/pagination.decorator';
import { PaginationDto } from '../../../common/dtos/pagination.dto';

@Controller('menu-type')
@ApiTags('Menu-type')
@SupplierAuth()
export class MenuTypeController {
  constructor(private readonly menuTypeService: MenuTypeService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() menuTypeDto: MenuTypeDto) {
    return this.menuTypeService.create(menuTypeDto);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.menuTypeService.findAll(paginationDto);
  }

  @Get(':id')
  findOneById(@Param('id', ParseIntPipe) id: number) {
    return this.menuTypeService.findOneById(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuTypeService.remove(id);
  }

  @Put(':id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() menuTypeDto: MenuTypeDto,
  ) {
    return this.menuTypeService.update(id, menuTypeDto);
  }
}
