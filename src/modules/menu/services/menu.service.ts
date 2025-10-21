import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuEntity } from '../entities/menu.entity';
import { DeepPartial, Repository } from 'typeorm';
import { MenuTypeService } from './type.service';
import { S3Service } from '../../s3/s3.service';
import { MenuTypeEntity } from '../entities/type.entity';
import { UpdateMenuDto } from '../dto/update-menu.dto';

@Injectable({ scope: Scope.REQUEST })
export class MenuService {
  constructor(
    @InjectRepository(MenuEntity)
    private menuRepository: Repository<MenuEntity>,
    @InjectRepository(MenuTypeEntity)
    private menuTypeRepository: Repository<MenuTypeEntity>,

    @Inject(REQUEST) private req: Request,

    private menuTypeService: MenuTypeService,
    private s3Service: S3Service,
  ) {}

  async create(foodDto: CreateMenuDto, image: Express.Multer.File) {
    const { id: supplierId } = this.req.user!;
    const { description, name, typeId, price, discount } = foodDto;

    const type = await this.menuTypeService.findOneById(typeId);

    const { Location, Key } = await this.s3Service.uploadFile(
      image,
      'menuItem',
    );

    const food = this.menuRepository.create({
      name,
      description,
      price,
      discount,
      supplierId,
      typeId: type.id,
      image: Location,
      imageKey: Key,
    });

    await this.menuRepository.save(food);

    return {
      message: 'Menu created successfully',
    };
  }

  async update(id: number, foodDto: UpdateMenuDto, image: Express.Multer.File) {
    const { id: supplierId } = this.req.user!;
    const { description, name, typeId, price, discount } = foodDto;

    const menu = await this.findOneById(id);

    const updateObject: DeepPartial<MenuEntity> = {};

    if (image) {
      const { Location, Key } = await this.s3Service.uploadFile(
        image,
        'menuItem',
      );

      if (Location) {
        updateObject['image'] = Location;
        updateObject['imageKey'] = Key;

        if (menu.imageKey) await this.s3Service.deleteFile(menu.imageKey);
      }
    }

    if (name) updateObject['name'] = name;
    if (description) updateObject['description'] = description;
    if (price) updateObject['price'] = price;
    if (discount) updateObject['discount'] = discount;
    if (typeId) updateObject['typeId'] = typeId;

    await this.menuRepository.update({ id, supplierId }, updateObject);

    return {
      message: 'Menu updated successfully',
    };
  }

  findAll(supplierId: number) {
    return this.menuTypeRepository.find({
      where: { supplierId },
      relations: {
        items: true,
      },
    });
  }

  async findOneById(id: number) {
    const { id: supplierId } = this.req.user!;

    const menu = await this.menuRepository.findOne({
      where: {
        id,
        supplierId,
      },
      relations: {
        type: true,
        feedbacks: {
          user: true,
        },
      },
      select: {
        feedbacks: {
          comment: true,
          createdAt: true,
          user: {
            first_name: true,
            last_name: true,
          },
          score: true,
        },
        type: {
          title: true,
        },
      },
    });

    if (!menu) throw new NotFoundException('Menu not found');

    return menu;
  }

  async delete(id: number) {
    await this.findOneById(id);

    await this.menuRepository.delete(id);

    return {
      message: 'Menu deleted successfully',
    };
  }

  async checkExist(id: number) {
    const item = await this.menuRepository.findOneBy({ id });
    if (!item) throw new NotFoundException('Menu not found');

    return item;
  }
}
