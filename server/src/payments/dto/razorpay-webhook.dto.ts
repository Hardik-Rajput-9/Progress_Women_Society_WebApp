import { IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RazorpayPaymentEntity {
  @IsString()
  id: string;

  @IsString()
  order_id: string;
}

class RazorpayPayload {
  @ValidateNested()
  @Type(() => RazorpayPaymentEntity)
  payment: { entity: RazorpayPaymentEntity };
}

export class RazorpayWebhookDto {
  @IsString()
  event: string;

  @IsObject()
  @ValidateNested()
  @Type(() => RazorpayPayload)
  payload: RazorpayPayload;
}
