// to do, change this from delete to PATCH or Cancel while what we are doing here
//is to cancel the request and deleting it entirely 
import express, {Request, Response} from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@moudtickets/common';
import { Order, OrderStatus } from '../models/order';
import {OrderCancelledPublisher} from '../events/publishers/order-cancelled-publisher';
import {natsWrapper} from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId',requireAuth  , async (req:Request, res:Response)=>{
  const {orderId} = req.params;
  const order = await Order.findById(orderId).populate('ticket');
  if(!order){
    throw new NotFoundError();
  }
  if(order.userId !== req.currentUser!.id){
    throw new NotAuthorizedError();
  }
  
  order.status = OrderStatus.Cancelled;
  await order.save();

  // we need to publish an event to show that this event was cancelled 
  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    ticket: order.ticket.id
  })


  res.status(204).send({order})
  //res.send({order});  
});

export { router as deleteOrderRouter };