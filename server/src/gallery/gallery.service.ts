import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateGalleryDto } from "./dto/create-gallery.dto";

@Injectable()
export class GalleryService {
  constructor(private prisma: PrismaService) {}

  create(createGalleryImageDto: CreateGalleryDto) {
    return this.prisma.galleryImage.create({ data: createGalleryImageDto });
  }

  findAll() {
    return this.prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  remove(id: string) {
    return this.prisma.galleryImage.delete({ where: { id } });
  }
}
