import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@moudtickets/common";
import { queueGroupName } from "./queeu-groupe-names";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListner extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}
