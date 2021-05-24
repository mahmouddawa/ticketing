import request from 'supertest';
import {app} from '../../app';
import {Ticket} from '../../models/ticket';
import {Order , OrderStatus} from '../../models/order';


it('should return the orders for the user', async()=>{
  const ticket = Ticket.build({
    title: 'concert',
    price: 30
  });
  await ticket.save();

  const user = global.signin();

  const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ticketId: ticket.id})
        .expect(201)


  const {body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(200)      
  
});
it('it returns an error if a user tries to fetch an order from another user', async()=>{
  const ticket = Ticket.build({
    title: 'concert',
    price: 30
  });
  await ticket.save();

  const user = global.signin();
  const userTwo = global.signin();

  const {body: order} = await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({ticketId: ticket.id})
        .expect(201)


 await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .expect(401)      
  
});