import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@moudtickets/common";
import { OrderCreatedListener } from "../oder-created-listner";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listner = new OrderCreatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: "concert",
    price: 12,
    userId: "1234",
  });
  await ticket.save();
  const data: OrderCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: "2134",
    expiresAt: "122",
    ticket: {
      id: ticket.id,
      price: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listner, ticket, msg, data };
};

it("set the userid of the ticket", async () => {
  const { listner, ticket, msg, data } = await setup();

  await listner.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});
it("calls the ack message", async () => {
  const { listner, ticket, msg, data } = await setup();
  await listner.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
it("", async () => {});
