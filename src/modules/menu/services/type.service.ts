import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuTypeEntity } from '../entities/type.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class MenuTypeService {
  constructor(
    @InjectRepository(MenuTypeEntity)
    private menuTypeRepository: Repository<MenuTypeEntity>,

    @Inject(REQUEST) private req: Request,
  ) {}

  async create(createMTDto: { title: string }) {
    const menuType = this.menuTypeRepository.create({
      title: createMTDto.title,
    });
    await this.menuTypeRepository.save(menuType);

    return {
      message: 'Menu type created successfully',
    };
  }

  findAll() {
    return this.menuTypeRepository.findAndCount({
      where: {},
      order: { id: 'DESC' },
    });
  }

  async findOneById(id: number) {
    const menuType = await this.menuTypeRepository.findOneBy({ id });
    if (!menuType) throw new NotFoundException('Menu type not found');
    return menuType;
  }

  async remove(id: number) {
    const menuType = await this.findOneById(id);
    await this.menuTypeRepository.delete(menuType);

    return {
      message: 'Menu type deleted successfully',
    };
  }
}
