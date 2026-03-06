import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  UnauthorizedException,
  RawBodyRequest,
} from "@nestjs/common";
import { DonationsService } from "../donations/donations.service";
import { RazorpayWebhookDto } from "./dto/razorpay-webhook.dto";
import { FastifyRequest } from "fastify";
import * as crypto from "crypto";

@Controller("payments/razorpay")
export class RazorpayController {
  constructor(private donations: DonationsService) {}

  @Post("webhook")
  async webhook(
    @Body() payload: RazorpayWebhookDto,
    @Headers("x-razorpay-signature") signature: string,
    @Req() req: RawBodyRequest<FastifyRequest>, // 👈 Fastify-specific raw body typing
  ) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error(
        "CRITICAL: RAZORPAY_WEBHOOK_SECRET is not set in environment.",
      );
      throw new Error("Webhook secret configuration missing");
    }

    // Ensure we have the raw body and the signature header
    const rawBody = req.rawBody;
    if (!rawBody || !signature) {
      throw new UnauthorizedException("Invalid payload or missing signature");
    }

    // Cryptographically verify the request came from Razorpay
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody.toString("utf8")) // Use the exact raw buffer
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("Webhook signature mismatch detected!");
      throw new UnauthorizedException("Invalid webhook signature");
    }

    // Process the verified payload
    if (payload.event === "payment.captured") {
      // Safely extract the data knowing it is authentically from Razorpay
      const { order_id, id: payment_id } = payload.payload.payment.entity;
      await this.donations.markCompleted(order_id, payment_id);
    }

    // Return 200 OK so Razorpay knows we received it
    return { status: "ok" };
  }
}
