import {Publisher, OrderCancelledEvent, Subjects} from '@moudtickets/common';


export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
  readonly subject = Subjects.OrderCancelled;
}