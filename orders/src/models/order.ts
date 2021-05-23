import mongoose from 'mongoose';
import { OrderStatus } from '@moudtickets/common';
import { TicketDoc } from './ticket';

export {OrderStatus};
// this export to have everything related to the order comming from the order model

interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}


interface OrderDoc extends mongoose.Document{
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface orderModel extends mongoose.Model<OrderDoc>{
  build(atrrs: OrderAttrs):OrderDoc;
}

const orderSchema = new mongoose.Schema({
  userId:{
    type:String,
    required: true
  },
  status:{
    type:String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  expiresAt:{
    type: mongoose.Schema.Types.Date,
  },
  ticket:{
    types: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  }
},
{
  toJSON: {
    transform(doc, ret){
      ret.id= ret._id;
      delete ret._id;
    }
  }
}
);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, orderModel>('Order', orderSchema);

export {Order};