import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProgramDto } from "./dto/create-program.dto";
import { UpdateProgramDto } from "./dto/update-program.dto";

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  async create(createProgramDto: CreateProgramDto) {
    return this.prisma.program.create({
      data: {
        ...createProgramDto,
        startDate: new Date(createProgramDto.startDate),
        endDate: createProgramDto.endDate
          ? new Date(createProgramDto.endDate)
          : null,
      },
    });
  }
  async findAll() {
    return this.prisma.program.findMany({
      include: {
        _count: {
          select: { donations: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const program = await this.prisma.program.findUnique({
      where: { id },
      include: {
        _count: { select: { donations: true } },
      },
    });

    if (!program) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
    return program;
  }

  async update(id: string, updateProgramDto: UpdateProgramDto) {
    try {
      return await this.prisma.program.update({
        where: { id },
        data: {
          ...updateProgramDto,
          startDate: updateProgramDto.startDate
            ? new Date(updateProgramDto.startDate)
            : undefined,
          endDate: updateProgramDto.endDate
            ? new Date(updateProgramDto.endDate)
            : undefined,
        },
      });
    } catch (_error) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.program.delete({
        where: { id },
      });
    } catch (_error) {
      throw new NotFoundException(`Program with ID ${id} not found`);
    }
  }
}
