import {
  Body,
  Controller,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SupplierService } from './supplier.service';
import {
  SupplementaryInformationDto,
  SupplierSignupDto,
  UploadDocsDto,
} from './dto/supplier.dto';
import { CheckOtpDto } from '../auth/dto/otp.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { SupplierAuth } from '../../common/decorators/auth.decorator';
import { uploadFileFieldsS3 } from '../../common/interceptors/upload-file.interceptor';
import { SwaggerConsumes } from '../../common/enum/swagger-consumes.enum';
import { DocumentType } from './type';

@Controller('supplier')
@ApiTags('Supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post('/signup')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  signup(@Body() supplierDto: SupplierSignupDto) {
    return this.supplierService.signup(supplierDto);
  }

  @Post('/check-otp')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  checkOtp(@Body() checkOtpDto: CheckOtpDto) {
    return this.supplierService.checkOtp(checkOtpDto);
  }

  @Post('/supplementary-information')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  @SupplierAuth()
  supplementaryInformation(@Body() infoDto: SupplementaryInformationDto) {
    return this.supplierService.saveSupplementaryInformation(infoDto);
  }

  @Put('/upload-documents')
  @ApiConsumes(SwaggerConsumes.Multipart)
  @SupplierAuth()
  @UseInterceptors(
    uploadFileFieldsS3([
      { name: 'acceptedDoc', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  uploadDocuments(
    @Body() uploadDocsDto: UploadDocsDto,
    @UploadedFiles() files: DocumentType,
  ) {
    return this.supplierService.uploadDocuments(files);
  }
}
