import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBasketEntity } from './entity/basket.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { BasketDto, DiscountBasketDto } from './dto/basket.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { MenuService } from '../menu/services/menu.service';
import { DiscountService } from '../discount/discount.service';

@Injectable({ scope: Scope.REQUEST })
export class BasketService {
  constructor(
    @InjectRepository(UserBasketEntity)
    private userBasketRepository: Repository<UserBasketEntity>,

    @Inject(REQUEST) private req: Request,

    private menuService: MenuService,
    private discountService: DiscountService,
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

  async addDiscount(discountDto: DiscountBasketDto) {
    const { code } = discountDto;
    const { id: userId } = this.req.user!;

    const discount = await this.discountService.findOneByCode(code);

    if (!discount.active) {
      throw new BadRequestException('discount is not active');
    }

    if (discount.limit && discount.limit <= discount.usage) {
      throw new BadRequestException('the capacity of discount is over');
    }

    if (
      discount?.expires_in &&
      discount.expires_in.getTime() <= new Date().getTime()
    ) {
      throw new BadRequestException('discount is expired');
    }

    const userBasketDiscount = await this.userBasketRepository.findBy({
      discountId: discount.id,
      userId,
    });

    if (userBasketDiscount) {
      throw new BadRequestException('discount already added to basket');
    }

    if (discount.supplierId) {
      const discountOfSupplier = await this.userBasketRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          discount: {
            supplierId: discount.supplierId,
          },
        },
      });

      if (discountOfSupplier) {
        throw new BadRequestException(
          'you can not use several discount code of supplier',
        );
      }

      const userBasket = await this.userBasketRepository.findOne({
        relations: {
          food: true,
        },
        where: {
          userId,
          food: {
            supplierId: discount.supplierId,
          },
        },
      });

      if (!userBasket) {
        throw new BadRequestException(
          'you can not use this discount code in basket',
        );
      }
    } else if (!discount.supplierId) {
      const generalDiscount = await this.userBasketRepository.findOne({
        relations: {
          discount: true,
        },
        where: {
          userId,
          discount: {
            id: Not(IsNull()),
            supplierId: IsNull(),
          },
        },
      });

      if (generalDiscount) {
        throw new BadRequestException('already have a discount in basket');
      }
    }

    await this.userBasketRepository.insert({
      discountId: discount.id,
      userId,
    });

    return {
      message: 'discount added to basket successfully',
    };
  }

  async removeDiscount(discountDto: DiscountBasketDto) {
    const { code } = discountDto;
    const { id: userId } = this.req.user!;

    const discount = await this.discountService.findOneByCode(code);

    const basketDiscount = await this.userBasketRepository.findOne({
      where: {
        discountId: discount.id,
      },
    });

    if (!basketDiscount)
      throw new BadRequestException('discount not found in basket');

    await this.userBasketRepository.delete({ discountId: discount.id, userId });

    return {
      message: 'discount removed from basket successfully',
    };
  }

  async getBasket() {}
}
