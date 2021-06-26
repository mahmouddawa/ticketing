import { Message } from "node-nats-streaming";
import { TicketCreatedEvent } from "@moudtickets/common";
import { TicketCreatedListner } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import Mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListner(natsWrapper.client);
  //create a fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new Mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: "concert",
    price: 10,
    userId: new Mongoose.Types.ObjectId().toHexString(),
  };
  //create a fake message object

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  //call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  //write asserstion to make sure ack function called
  expect(msg.ack).toHaveBeenCalled();
});
