import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@moudtickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queeu-groupe-names";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
