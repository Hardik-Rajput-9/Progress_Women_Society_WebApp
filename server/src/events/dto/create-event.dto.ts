import { IsString, IsOptional, IsEnum, IsDateString } from "class-validator";
import { EventStatus } from "@prisma/client";

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsString()
  timeString: string;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsEnum(EventStatus)
  @IsOptional()
  status?: EventStatus;
}
