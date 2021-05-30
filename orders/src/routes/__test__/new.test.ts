import request from 'supertest';
import {app} from '../../app';
import mongoose from 'mongoose';
import {Order, OrderStatus} from '../../models/order';
import { Ticket} from '../../models/ticket';
import {natsWrapper} from '../../nats-wrapper';


it('returns an error if the user does not exist', async ()=>{
  // random mongoose ticketId
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ticketId})
        .expect(404)
});

it('returns an error if the ticket was already reserved', async ()=>{
  const ticket = Ticket.build({
    title: 'new',
    price: 20
  });
  await ticket.save();
  const order = Order.build({
    userId: 'asdjnkhf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  })
  await order.save();

  await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ticketId: ticket._id})
        .expect(400);
});

it('reserves a ticket', async()=>{

  const ticket = Ticket.build({
    title: 'new ticket',
    price: 30
  });
  await ticket.save();
  await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ticketId: ticket._id})
        .expect(201)

});

it('emits an order created event', async()=>{
  const ticket = Ticket.build({
    title: 'concert',
    price: 50
  })
  
  await ticket.save();
  await request(app)
  .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ticketId: ticket.id})
        .expect(201)

expect(natsWrapper.client.publish).toHaveBeenCalled() ;

})

//to do you can add the tests that are already been added to the ticket test, to check if the 
//user is authenticated and .. 
