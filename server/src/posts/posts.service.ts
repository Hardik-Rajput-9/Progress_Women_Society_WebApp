import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        author: createPostDto.author || "Admin Team",
        status: createPostDto.status || "PUBLISHED",
      },
    });
  }

  findAll() {
    return this.prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) throw new NotFoundException("Post not found");
    return post;
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    return this.prisma.post.update({ where: { id }, data: updatePostDto });
  }

  remove(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }
}
