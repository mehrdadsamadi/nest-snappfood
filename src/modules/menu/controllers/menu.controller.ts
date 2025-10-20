import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SwaggerConsumes } from '../../../common/enum/swagger-consumes.enum';
import { UploadFileS3 } from '../../../common/interceptors/upload-file.interceptor';
import { SupplierAuth } from '../../../common/decorators/auth.decorator';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';

@Controller('menu')
@ApiTags('Menu')
@SupplierAuth()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

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
    createMenuDto: CreateMenuDto,
  ) {
    return this.menuService.create(createMenuDto, image);
  }

  @Get('/get-menu-by-supplierId/:supplierId')
  @SkipAuth()
  findAll(@Param('supplierId', ParseIntPipe) supplierId: number) {
    return this.menuService.findAll(supplierId);
  }
}
