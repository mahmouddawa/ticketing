import mongoose from 'mongoose';
import express, {Request, Response} from 'express';
import { BadRequestError, NotFoundError,
   OrderStatus, requireAuth, validateRequest} from '@moudtickets/common';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher';
import {natsWrapper} from '../nats-wrapper';

const router = express.Router();

// time window for the customer to pay for this order
//while this settings will effect how our app behave, this is an important setting, we
// can extract this to an environment variable(kubernetes config file)
//save this number of second to the db and put some kind of web UI that allow an aministrator
// to change it on the  fly
const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post('/api/orders',requireAuth,[
  body('ticketId')
  .not()
  .isEmpty()
  .custom((input: string)=> mongoose.Types.ObjectId.isValid(input))
  .withMessage('ticket id must be provided')
  ], 
  validateRequest,
  async (req:Request, res:Response)=>{
    const { ticketId } = req.body;

    // find the ticket that the user requested in the DB

    const ticket = await Ticket.findById(ticketId);
    if(!ticket){
      throw new NotFoundError;
    }
    //Make sure that this ticket is not reserved    
    const isReserved = await ticket.isReserved();

    if(isReserved){
      throw new BadRequestError('Ticket is already reserved');
    }
    
    // calculate an expiration data for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds()+ EXPIRATION_WINDOW_SECONDS); 
    // Build the order and save it to the db
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });
    await order.save();
    // Publish an event to let other services know that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });
  res.status(201).send(order);
});

export { router as newOrderRouter };