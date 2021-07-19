import { Subjects, Publisher, PaymentCreatedEvent } from '@moudtickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymetnCreated;
}
