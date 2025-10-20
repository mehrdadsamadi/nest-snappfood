import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuTypeEntity } from '../entities/type.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { MenuTypeDto } from '../dto/menu-type.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from '../../../common/utils/pagination.util';

@Injectable({ scope: Scope.REQUEST })
export class MenuTypeService {
  constructor(
    @InjectRepository(MenuTypeEntity)
    private menuTypeRepository: Repository<MenuTypeEntity>,

    @Inject(REQUEST) private req: Request,
  ) {}

  async create(menuTypeDto: MenuTypeDto) {
    const { id } = this.req.user!;

    const menuType = this.menuTypeRepository.create({
      title: menuTypeDto.title,
      supplierId: id,
    });
    await this.menuTypeRepository.save(menuType);

    return {
      message: 'Menu type created successfully',
    };
  }

  async update(id: number, menuTypeDto: MenuTypeDto) {
    const menuType = await this.findOneById(id);

    const { title } = menuTypeDto;
    if (title) menuType.title = title;

    await this.menuTypeRepository.save(menuType);

    return {
      message: 'Menu type updated successfully',
    };
  }

  async findAll(paginationDto: PaginationDto) {
    const { id } = this.req.user!;
    const { page, limit, skip } = paginationSolver(paginationDto);

    const [types, count] = await this.menuTypeRepository.findAndCount({
      where: {
        supplierId: id,
      },
      skip,
      take: limit,
      order: {
        id: 'DESC',
      },
    });

    return {
      types,
      pagination: paginationGenerator(count, page, limit),
    };
  }

  async findOneById(id: number) {
    const { id: supplierId } = this.req.user!;

    const menuType = await this.menuTypeRepository.findOneBy({
      id,
      supplierId,
    });
    if (!menuType) throw new NotFoundException('Menu type not found');
    return menuType;
  }

  async remove(id: number) {
    await this.findOneById(id);
    await this.menuTypeRepository.delete(id);

    return {
      message: 'Menu type deleted successfully',
    };
  }
}
