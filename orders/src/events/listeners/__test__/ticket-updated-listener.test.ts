import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@moudtickets/common";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listners";
import mongoose from "mongoose";

const setup = async () => {
  // create a listner
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert ",
    price: 30,
  });
  // create a fake data onjekct
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 90,
    userId: "s234",
  };
  //create a fake msg objekt
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  //return all of this

  return { listener, data, msg };
};

it("find, updates and saves a ticket", async () => {});

it("acks the message", async () => {});
