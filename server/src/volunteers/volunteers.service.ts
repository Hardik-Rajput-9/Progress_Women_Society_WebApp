import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateVolunteerDto } from "./dto/create-volunteer.dto";
import { UpdateVolunteerDto } from "./dto/update-volunteer.dto";
import { Prisma } from "@prisma/client"; // Import Prisma for error checking

@Injectable()
export class VolunteersService {
  constructor(private prisma: PrismaService) {}

  async create(createVolunteerDto: CreateVolunteerDto) {
    const { programId, ...volunteerData } = createVolunteerDto;

    try {
      return await this.prisma.volunteer.create({
        data: {
          ...volunteerData,
          program: programId ? { connect: { id: programId } } : undefined,
        },
        include: { program: true },
      });
    } catch (error) {
      // Catch duplicate email error (P2002 is Prisma's Unique Constraint code)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException(
            "An application with this email already exists.",
          );
        }
      }
      // If it's a different error, throw it normally
      throw error;
    }
  }

  async findAll() {
    return this.prisma.volunteer.findMany({
      orderBy: { createdAt: "desc" },
      include: { program: { select: { name: true } } }, // Optional: Include program name in lists
    });
  }

  async findOne(id: string) {
    const volunteer = await this.prisma.volunteer.findUnique({
      where: { id },
      include: { program: true },
    });

    if (!volunteer) {
      throw new NotFoundException(`Volunteer with ID ${id} not found`);
    }
    return volunteer;
  }

  async update(id: string, updateVolunteerDto: UpdateVolunteerDto) {
    try {
      return await this.prisma.volunteer.update({
        where: { id },
        data: updateVolunteerDto,
      });
    } catch (_error) {
      throw new NotFoundException(`Volunteer with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.volunteer.delete({
        where: { id },
      });
    } catch (_error) {
      throw new NotFoundException(`Volunteer with ID ${id} not found`);
    }
  }
}
