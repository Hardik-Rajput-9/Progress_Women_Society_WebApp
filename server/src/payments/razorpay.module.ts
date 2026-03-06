import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { RazorpayService } from './razorpay.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'RAZORPAY_INSTANCE',
      useFactory: (configService: ConfigService) => {
        return new Razorpay({
          key_id: configService.get('RAZORPAY_KEY_ID'),
          key_secret: configService.get('RAZORPAY_KEY_SECRET'),
        });
      },
      inject: [ConfigService],
    },
    RazorpayService,
  ],
  exports: [RazorpayService],
})
export class RazorpayModule {}