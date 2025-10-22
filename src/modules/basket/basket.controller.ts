import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { BasketService } from './basket.service';
import { BasketDto, DiscountBasketDto } from './dto/basket.dto';
import { UserAuth } from '../../common/decorators/auth.decorator';
import { SwaggerConsumes } from '../../common/enum/swagger-consumes.enum';

@Controller('basket')
@ApiTags('Basket')
@UserAuth()
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Post()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addToBasket(@Body() basketDto: BasketDto) {
    return this.basketService.addToBasket(basketDto);
  }

  @Delete()
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  removeFromBasket(@Body() basketDto: BasketDto) {
    return this.basketService.removeFromBasket(basketDto);
  }

  @Post('/discount')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  addDiscountToBasket(@Body() basketDto: DiscountBasketDto) {
    return this.basketService.addDiscount(basketDto);
  }

  @Delete('/discount')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  removeDiscountFromBasket(@Body() basketDto: DiscountBasketDto) {
    return this.basketService.removeDiscount(basketDto);
  }

  @Get()
  getBasket() {
    return this.basketService.getBasket();
  }
}
