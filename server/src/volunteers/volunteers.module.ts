import { Module } from "@nestjs/common";
import { VolunteersController } from "./volunteer.controller";
import { VolunteersService } from "./volunteers.service";

@Module({
  controllers: [VolunteersController],
  providers: [VolunteersService],
  exports: [VolunteersService],
})
export class VolunteersModule {}
