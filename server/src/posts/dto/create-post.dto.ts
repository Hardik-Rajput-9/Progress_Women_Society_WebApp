import { IsString, IsOptional } from "class-validator";

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  excerpt: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  category: string;

  @IsString()
  imageUrl: string;

  @IsString()
  @IsOptional()
  status?: string;
}
