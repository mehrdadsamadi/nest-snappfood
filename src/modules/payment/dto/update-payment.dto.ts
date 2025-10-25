import { PartialType } from '@nestjs/swagger';
import { PaymentGatewayDto } from './payment.dto';

export class UpdatePaymentDto extends PartialType(PaymentGatewayDto) {}
