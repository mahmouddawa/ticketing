import { Subjects } from './subjects';

export interface PaymetnCreatedEvent {
  subject: Subjects.PaymetnCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
