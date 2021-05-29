import express, {Request, Response} from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth} from '@moudtickets/common';
import {Order} from '../models/order';


const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req:Request, res:Response)=>{
  //we can add a validation step to make sure this is a valid mongo id before searching 
  const order = await Order.findById(req.params.orderId).populate('ticket');
  if(!order){
    throw new NotFoundError;
  }
  if(order.userId!== req.currentUser!.id){
    throw new NotAuthorizedError();
  }
  
  res.send({order});
});

export { router as showOrderRouter };