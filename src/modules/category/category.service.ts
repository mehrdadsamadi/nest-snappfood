import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeepPartial, Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { isBoolean, toBoolean } from '../../common/utils/functions.utils';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../common/utils/pagination.util';

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
    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      'category',
    );

    let { title, slug, show, parentId } = createCategoryDto;

    const category = await this.findOneBySlug(slug);

    if (category) throw new ConflictException('Category already exists');

    if (isBoolean(show)) {
      show = toBoolean(show);
    }

    let parent: CategoryEntity | null = null;

    if (parentId && !isNaN(parseInt(parentId.toString()))) {
      parent = await this.findOneById(parentId);
    }

    await this.categoryRepository.insert({
      title,
      slug,
      image: Location,
      imageKey: Key,
      show,
      parentId: parent?.id,
    });

    return {
      message: 'Category created successfully',
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, skip } = paginationSolver(paginationDto);

    const [categories, count] = await this.categoryRepository.findAndCount({
      relations: {
        parent: true,
      },
      select: {
        parent: {
          title: true,
        },
      },
      skip,
      take: limit,
      order: {
        id: 'DESC',
      },
    });

    return {
      categories,
      pagination: paginationGenerator(count, page, limit),
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

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    image: Express.Multer.File,
  ) {
    const { title, slug, show, parentId } = updateCategoryDto;

    const category = await this.findOneById(id);

    const updateObject: DeepPartial<CategoryEntity> = {};

    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        'category',
      );

      if (Location) {
        updateObject['image'] = Location;
        updateObject['imageKey'] = Key;

        if (category?.imageKey)
          await this.s3Service.deleteFile(category?.imageKey);
      }
    }

    if (title) updateObject['title'] = title;
    if (show && isBoolean(show)) updateObject['show'] = toBoolean(show);

    if (parentId && !isNaN(parseInt(parentId.toString()))) {
      const parent = await this.findOneById(+parentId);
      updateObject['parentId'] = parent?.id;
    }

    if (slug) {
      const category = await this.findOneBySlug(slug);
      if (category && category.id !== id)
        throw new ConflictException('Category already exists');

      updateObject['slug'] = slug;
    }

    await this.categoryRepository.update({ id }, updateObject);

    return {
      message: 'Category updated successfully',
    };
  }

  async remove(id: number) {
    await this.findOneById(id);

    await this.categoryRepository.delete({ id });

    return {
      message: 'Category deleted successfully',
    };
  }

  async findBySlugWithChild(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        slug,
      },
      relations: {
        children: true,
      },
    });

    if (!category) throw new NotFoundException('Category not found');

    return {
      category,
    };
  }
}
