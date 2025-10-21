import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBasketEntity } from './entity/basket.entity';
import { Repository } from 'typeorm';
import { BasketDto } from './dto/basket.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { MenuService } from '../menu/services/menu.service';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(UserBasketEntity)
    private userBasketRepository: Repository<UserBasketEntity>,

    @Inject(REQUEST) private req: Request,

    private menuService: MenuService,
  ) {}

  async addToBasket(basketDto: BasketDto) {
    const { id: userId } = this.req.user!;
    const { foodId } = basketDto;

    await this.menuService.checkExist(foodId);

    let basketItem = await this.userBasketRepository.findOne({
      where: {
        foodId,
        userId,
      },
    });
    if (basketItem) {
      basketItem.count += 1;
    } else {
      basketItem = this.userBasketRepository.create({
        foodId,
        userId,
        count: 1,
      });
    }

    await this.userBasketRepository.save(basketItem);

    return {
      message: 'Food added to basket successfully',
    };
  }

  async removeFromBasket(basketDto: BasketDto) {
    const { id: userId } = this.req.user!;
    const { foodId } = basketDto;

    await this.menuService.checkExist(foodId);

    const basketItem = await this.userBasketRepository.findOne({
      where: {
        foodId,
        userId,
      },
    });

    if (basketItem) {
      if (basketItem.count > 1) {
        basketItem.count -= 1;
        await this.userBasketRepository.save(basketItem);
      } else {
        await this.userBasketRepository.delete({ id: basketItem.id });
      }

      return {
        message: 'Food removed from basket successfully',
      };
    }

    throw new NotFoundException('Food not found in basket');
  }
}
