import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadFileS3 } from '../../common/interceptors/upload-file.interceptor';
import { Pagination } from '../../common/decorators/pagination.decorator';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { SwaggerConsumes } from '../../common/enum/swagger-consumes.enum';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.Multipart)
  @UseInterceptors(UploadFileS3('image'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: 'image/(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    image: Express.Multer.File,
    @Body()
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto, image);
  }

  @Get('/by-slug-with-child/:slug')
  findBySlugWithChild(@Param('slug') slug: string) {
    return this.categoryService.findBySlugWithChild(slug);
  }

  @Get()
  @Pagination()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.categoryService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOneById(id);
  }

  @Patch(':id')
  @ApiConsumes(SwaggerConsumes.Multipart)
  @UseInterceptors(UploadFileS3('image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 10 }),
          new FileTypeValidator({ fileType: 'image/(png|jpeg|jpg|webp)' }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.categoryService.update(id, updateCategoryDto, image);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
