import { Listener, OrderCreatedEvent, Subjects } from "@moudtickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupeName";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    await expirationQueue.add({
      orderId: data.id,
    });
    msg.ack();
  }
}
