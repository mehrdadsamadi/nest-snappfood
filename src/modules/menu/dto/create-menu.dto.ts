import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ format: 'binary' })
  image: string;

  @ApiProperty()
  price: number;

  @ApiPropertyOptional()
  discount: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  typeId: number;
}
