// to do, change this from delete to PATCH or Cancel while what we are doing here
//is to cancel the request and deleting it entirely 
import express, {Request, Response} from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@moudtickets/common';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId',requireAuth  , async (req:Request, res:Response)=>{
  const {orderId} = req.params;
  const order = await Order.findById(orderId);
  if(!order){
    throw new NotFoundError();
  }
  if(order.userId !== req.currentUser!.id){
    throw new NotAuthorizedError();
  }
  
  order.status = OrderStatus.Cancelled;
  await order.save();

  // we need to publish an event to show that this event was cancelled 
  res.status(204).send({order})
  //res.send({order});  
});

export { router as deleteOrderRouter };