import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags } from '@nestjs/swagger';
import { UserAuth } from '../../common/decorators/auth.decorator';
import { PaymentGatewayDto } from './dto/payment.dto';
import { Response } from 'express';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UserAuth()
  gatewayUrl(@Body() paymentDto: PaymentGatewayDto) {
    return this.paymentService.getGatewayUrl(paymentDto);
  }

  @Get('/verify')
  async verifyPayment(
    @Query('Authority') authority: string,
    @Query('Status') status: string,
    @Res() res: Response,
  ) {
    const url = await this.paymentService.verify(authority, status);

    return res.redirect(url);
  }
}
