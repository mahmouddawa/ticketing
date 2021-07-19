import {
  Listener,
  PaymentCreatedEvent,
  Subjects,
  OrderStatus,
} from '@moudtickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymetnCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('order not found!');
    }
    // to do, add OrderStatus.Updated to the OrderSatus and share this
    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
