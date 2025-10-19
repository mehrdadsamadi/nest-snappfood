import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIdentityCard,
  IsMobilePhone,
  Length,
} from 'class-validator';

export class SupplierSignupDto {
  @ApiProperty()
  @Length(3, 50)
  manager_name: string;

  @ApiProperty()
  @Length(3, 50)
  manager_family: string;

  @ApiProperty()
  @Length(3, 50)
  store_name: string;

  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: 'mobile is not valid' })
  phone: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  invite_code: string;

  @ApiProperty()
  categoryId: number;
}

export class SupplementaryInformationDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsIdentityCard('IR')
  national_code: string;
}

export class UploadDocsDto {
  @ApiProperty({ format: 'binary' })
  acceptedDoc: string;

  @ApiProperty({ format: 'binary' })
  image: string;
}
