import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsArray,
  IsDateString,
} from "class-validator";
import { VolunteerStatus, VolunteerAvailability } from "@pws/shared";

export class CreateVolunteerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsArray()
  @IsString({ each: true })
  skills: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @IsEnum(VolunteerAvailability)
  @IsOptional()
  availability?: VolunteerAvailability;

  @IsDateString()
  @IsOptional()
  joinedDate?: string;

  @IsEnum(VolunteerStatus)
  @IsOptional()
  status?: VolunteerStatus;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  programId?: string;
}
