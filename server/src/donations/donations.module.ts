import { Module } from "@nestjs/common";
import { DonationsService } from "./donations.service";
import { DonationsController } from "./donations.controller";
import { PrismaModule } from "../prisma/prisma.module";
// import { RazorpayModule } from '../payments/razorpay.module';

@Module({
  imports: [PrismaModule /* RazorpayModule */],
  controllers: [DonationsController],
  providers: [DonationsService],
  exports: [DonationsService],
})
export class DonationsModule {}
