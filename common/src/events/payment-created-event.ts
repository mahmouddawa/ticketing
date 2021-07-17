import { Subjects } from './subjects';

export interface PaymentCreatedEvent {
  subject: Subjects.PaymetnCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
