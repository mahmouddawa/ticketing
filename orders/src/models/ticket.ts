import mongoose from 'mongoose';
import {Order } from './order';
import {OrderStatus} from '@moudtickets/common';
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // minimum price of Zero
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};


ticketSchema.methods.isReserved = async function () {
// this === the ticket document that we just called "isReserved" on

  //Run query to llok at all orders. find an order where the ticket is 
  // the ticket we just found and the orders status is NOT cancelled.
  //If we find an order from that means that tickt IS reserved
  const existingOrder = await Order.findOne({

    ticket: this.id,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitaingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  // if it was null it will flip to true then to false(to only return ture or false)
  // if it was true we will flip to false then to true
  return !!existingOrder;
};

const Ticket  = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket }