import { IsMobilePhone, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: 'شماره موبایل معتبر نمیباشد' })
  mobile: string;
}

export class CheckOtpDto {
  @ApiProperty()
  @IsMobilePhone('fa-IR', {}, { message: 'شماره موبایل معتبر نمیباشد' })
  mobile: string;

  @ApiProperty()
  @IsString()
  @Length(5, 5, { message: 'کد وارد شده باید ۵ عدد باشد' })
  code: string;
}
