import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentGatewayDto {
  @ApiProperty()
  addressId: number;

  @ApiPropertyOptional()
  description?: string;
}

export class CreatePaymentDto {
  amount: number;
  invoice_number: string;
  orderId: number;
  status: boolean;
  userId: number;
}
