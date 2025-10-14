import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { isBoolean, toBoolean } from '../../common/utils/functions.utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
    private s3Service: S3Service,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image: Express.Multer.File,
  ) {
    const { Location } = await this.s3Service.uploadFile(image, 'category');

    let { title, slug, show, parentId } = createCategoryDto;

    const category = await this.findOneBySlug(slug);

    if (category) throw new ConflictException('Category already exists');

    if (isBoolean(show)) {
      show = toBoolean(show);
    }

    let parent: CategoryEntity | null = null;

    if (parentId && !isNaN(parentId)) {
      parent = await this.findOneById(parentId);
    }

    await this.categoryRepository.insert({
      title,
      slug,
      image: Location,
      show,
      parentId: parent?.id,
    });

    return {
      message: 'Category created successfully',
    };
  }

  async findAll() {
    const [categories, count] = await this.categoryRepository.findAndCount({
      relations: {
        parent: true,
      },
      select: {
        parent: {
          title: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      categories,
    };
  }

  async findOneById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });

    if (!category) throw new NotFoundException('Category not found');

    return category;
  }

  findOneBySlug(slug: string) {
    return this.categoryRepository.findOneBy({ slug });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
