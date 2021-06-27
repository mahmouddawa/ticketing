import { natsWrapper } from "../../../nats-wrapper";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "@moudtickets/common";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedListener } from "../ticket-updated-listners";
import mongoose, { set } from "mongoose";

const setup = async () => {
  // create a listner
  const listener = new TicketUpdatedListener(natsWrapper.client);
  // create and save a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: "concert ",
    price: 30,
  });

  await ticket.save();
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

  return { listener, ticket, data, msg };
};

it("find, updates and saves a ticket", async () => {
  const { listener, ticket, data, msg } = await setup();
  console.log("the data is ", data, "andd the ticket is ", ticket);

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const {  msg, data, listener  } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();});

it("it does not call ack if the event has a skipped version number", async () => {
  const {msg, data, ticket, listener} = await setup();
  data.version = 10;
  try{
    await listener.onMessage(data, msg)}
    catch(err){}
  expect(msg.ack).not.toHaveBeenCalled();
  
});
