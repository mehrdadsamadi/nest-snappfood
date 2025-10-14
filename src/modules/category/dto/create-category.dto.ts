import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  slug: string;

  @ApiProperty({ format: 'binary' })
  image: string;

  @ApiProperty()
  show: boolean;

  @ApiPropertyOptional()
  parentId: number;
}
