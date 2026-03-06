import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Headers,
  BadRequestException,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { DonationsService } from "./donations.service";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "@pws/shared";

@Controller("donations")
@UseInterceptors(ClassSerializerInterceptor)
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  // Admin creation
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.create(createDonationDto);
  }

  // Public checkout
  @Post("checkout")
  initiatePayment(@Body() createDonationDto: CreateDonationDto) {
    return this.donationsService.initiatePayment(createDonationDto);
  }

  // Payment verification
  @Post("verify")
  async verifyPayment(
    @Body() body: { orderId: string; paymentId: string; signature: string },
  ) {
    try {
      return await this.donationsService.verifyPayment(
        body.orderId,
        body.paymentId,
        body.signature,
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Admin-only routes
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.donationsService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findOne(@Param("id") id: string) {
    return this.donationsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param("id") id: string,
    @Body() updateDonationDto: UpdateDonationDto,
  ) {
    return this.donationsService.update(id, updateDonationDto);
  }

  @Delete(":id")
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.donationsService.remove(id);
  }
}
