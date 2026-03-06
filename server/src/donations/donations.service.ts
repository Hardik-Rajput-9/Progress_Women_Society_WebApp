import { Injectable, NotFoundException, Optional } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RazorpayService } from "../payments/razorpay.service";
import { CreateDonationDto } from "./dto/create-donation.dto";
import { UpdateDonationDto } from "./dto/update-donation.dto";
import { DonationStatus } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DonationsService {
  constructor(
    private prisma: PrismaService,
    @Optional() private razorpay: RazorpayService,
    private config: ConfigService,
  ) {}

  // Admin creation without payment
  async create(createDonationDto: CreateDonationDto) {
    const { programId, ...donationData } = createDonationDto;

    return this.prisma.donation.create({
      data: {
        ...donationData,
        status: DonationStatus.COMPLETED,
        program: programId ? { connect: { id: programId } } : undefined,
      },
      include: { program: true },
    });
  }

  // Public checkout flow
  async initiatePayment(createDonationDto: CreateDonationDto) {
    if (!this.razorpay) throw new Error("Payment service not available");

    const { programId, ...donationData } = createDonationDto;

    // Create pending donation
    const donation = await this.prisma.donation.create({
      data: {
        ...donationData,
        status: DonationStatus.PENDING,
        program: programId ? { connect: { id: programId } } : undefined,
      },
    });

    // Create Razorpay order
    const order = await this.razorpay.createOrder(
      donationData.amount,
      donationData.currency || "INR",
      donation.id,
    );

    // Link order ID
    await this.prisma.donation.update({
      where: { id: donation.id },
      data: { PaymentOrderId: order.id },
    });

    return {
      donationId: donation.id,
      orderId: order.id,
      keyId: this.config.get("RAZORPAY_KEY_ID"),
    };
  }

  // Frontend manual verification fallback
  async verifyPayment(orderId: string, paymentId: string, signature: string) {
    if (!this.razorpay) throw new Error("Payment service not available");

    const isValid = this.razorpay.verifySignature(
      orderId,
      paymentId,
      signature,
    );
    if (!isValid) throw new Error("Invalid payment signature");

    return this.markCompleted(orderId, paymentId);
  }

  // The RazorpayController now handles raw buffer signature verification securely.

  async findAll() {
    return this.prisma.donation.findMany({
      include: { program: { select: { name: true, id: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string) {
    const donation = await this.prisma.donation.findUnique({
      where: { id },
      include: { program: true },
    });
    if (!donation)
      throw new NotFoundException(`Donation with id ${id} not found`);
    return donation;
  }

  async update(id: string, updateDonationDto: UpdateDonationDto) {
    const { programId, ...donationData } = updateDonationDto;
    try {
      return await this.prisma.donation.update({
        where: { id },
        data: {
          ...donationData,
          program: programId ? { connect: { id: programId } } : undefined,
        },
        include: { program: true },
      });
    } catch (_error) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.donation.delete({ where: { id } });
    } catch (_error) {
      throw new NotFoundException(`Donation with ID ${id} not found`);
    }
  }

  // Called securely by the Webhook Controller
  async markCompleted(orderId: string, paymentId: string) {
    try {
      return await this.prisma.donation.update({
        where: { PaymentOrderId: orderId },
        data: {
          paymentId,
          status: DonationStatus.COMPLETED,
          completedAt: new Date(),
        },
      });
    } catch (_error) {
      throw new NotFoundException(
        `Donation with payment order ID ${orderId} not found`,
      );
    }
  }
}
