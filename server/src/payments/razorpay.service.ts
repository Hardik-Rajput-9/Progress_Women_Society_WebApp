import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RazorpayService {
  public readonly instance: Razorpay;
  private readonly webhookSecret: string;

  constructor(private config: ConfigService) {
    this.instance = new Razorpay({
      key_id: this.config.get<string>('RAZORPAY_KEY_ID')!,
      key_secret: this.config.get<string>('RAZORPAY_KEY_SECRET')!,
    });
    this.webhookSecret =
      this.config.get<string>('RAZORPAY_WEBHOOK_SECRET') ?? '';
  }

  async createOrder(
    amountInRupees: number,
    currency = 'INR',
    receipt = '',
  ) {
    try {
      return await this.instance.orders.create({
        amount: Math.round(amountInRupees * 100), // → paise
        currency,
        receipt,
      });
    } catch (err) {
      throw new InternalServerErrorException(
        'Unable to create Razorpay order',
        err as any,
      );
    }
  }

  verifySignature(
    orderId: string,
    paymentId: string,
    providedSignature: string,
  ) {
    const secret = this.config.get<string>('RAZORPAY_KEY_SECRET');
    if (!secret) {
      throw new Error('RAZORPAY_KEY_SECRET is not configured');
    }

    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${orderId}|${paymentId}`);
    const expected = hmac.digest('hex');
    return expected === providedSignature;
  }

  verifyWebhookSignature(rawBody: string, signature: string) {
    const expected = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');
    return expected === signature;
  }
}