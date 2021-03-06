import mongoose from 'mongoose';
import request from 'supertest';
import {app }  from '../../app';
import {Order, OrderStatus} from '../../models/order';
import {Ticket} from '../../models/ticket';
import {natsWrapper} from '../../nats-wrapper';



it('marks an order as concelled', async ()=>{
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'conceert',
    price: 30,

  });

  ticket.save();
  
  const user = global.signin();

  const {body: order} =  await request(app)
          .post('/api/orders')
          .set('Cookie', user)
          .send({ticketId: ticket.id})
          .expect(201)

    //cancel the order
    await request(app)
          .delete(`/api/orders/${order.id}`)
          .set('Cookie', user)
          .send()
          .expect(204)

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
     
});

it('emits order cancelled event', async()=>{
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'conceert',
    price: 30
  });

  ticket.save();
  
  const user = global.signin();

  const {body: order} =  await request(app)
          .post('/api/orders')
          .set('Cookie', user)
          .send({ticketId: ticket.id})
          .expect(201)

    //cancel the order
    await request(app) 
          .delete(`/api/orders/${order.id}`)
          .set('Cookie', user)
          .send()
          .expect(204)

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

