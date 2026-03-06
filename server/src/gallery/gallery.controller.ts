import { Controller, Get, Post, Body, Param, Delete } from "@nestjs/common";
import { GalleryService } from "./gallery.service";
import { CreateGalleryDto } from "./dto/create-gallery.dto";

@Controller("gallery")
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  create(@Body() createGalleryImageDto: CreateGalleryDto) {
    return this.galleryService.create(createGalleryImageDto);
  }

  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.galleryService.remove(id);
  }
}
