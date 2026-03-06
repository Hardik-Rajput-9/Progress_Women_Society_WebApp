import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalPrograms, totalEvents, activeVolunteers, donationsAgg] =
      await Promise.all([
        this.prisma.program.count(),
        this.prisma.event.count(),
        this.prisma.volunteer.count({
          where: { status: "ACTIVE" },
        }),
        this.prisma.donation.aggregate({
          _sum: { amount: true },
          where: { status: "COMPLETED" },
        }),
      ]);

    let totalDonations = 0;
    const rawSum = donationsAgg._sum.amount;

    if (rawSum !== null && rawSum !== undefined) {
      if (
        typeof rawSum === "object" &&
        typeof (rawSum as any).toNumber === "function"
      ) {
        totalDonations = (rawSum as any).toNumber();
      } else {
        totalDonations = Number(rawSum);
      }
    }

    return {
      totalPrograms,
      totalEvents,
      activeVolunteers,
      totalDonations: isNaN(totalDonations) ? 0 : totalDonations,
    };
  }
}
