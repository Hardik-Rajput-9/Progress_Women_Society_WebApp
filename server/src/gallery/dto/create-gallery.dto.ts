import { IsString } from "class-validator";

export class CreateGalleryDto {
  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsString()
  url: string;
}
