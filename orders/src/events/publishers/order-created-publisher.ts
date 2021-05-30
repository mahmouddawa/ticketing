import { Publisher, OrderCreatedEvent, Subjects } from '@moudtickets/common';


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
  readonly subject = Subjects.OrderCreated;
}