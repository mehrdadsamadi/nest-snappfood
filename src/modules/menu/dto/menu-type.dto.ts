import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class MenuTypeDto {
  @ApiProperty()
  @Length(3, 20, { message: 'title must be between 3 and 20 characters' })
  title: string;
}
