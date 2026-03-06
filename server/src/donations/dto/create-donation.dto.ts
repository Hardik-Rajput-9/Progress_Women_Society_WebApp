import {
  IsString,
  IsNumber,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsEnum,
  Min,
  IsUUID,
} from "class-validator";
import { DonationStatus } from "@pws/shared";

export class CreateDonationDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  donorName: string;

  @IsEmail()
  donorEmail: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous: boolean;

  @IsString()
  @IsOptional()
  message?: string;

  @IsEnum(DonationStatus)
  @IsOptional()
  status?: DonationStatus;

  @IsUUID()
  @IsOptional()
  programId?: string;
}
