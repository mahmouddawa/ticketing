import { OrderStatus } from '@moudtickets/common';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payments';

jest.mock('../../stripe');

// it('returns a 404 when puchasing an order that does not exist', async () => {
//   await request(app).post('/api/payments').set('Cookie', global.singin()).send({
//     token: 'laskdj',

//     orderId: mongoose.Types.ObjectId().toHexString(),
//   });
//   expect(404);
// });

// it('returns a 401 when purchasing an order that does not belong to the user', async () => {
//   const order = Order.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     userId: mongoose.Types.ObjectId().toHexString(),
//     version: 0,
//     price: 40,
//     status: OrderStatus.Created,
//   });

//   await order.save();

//   await request(app).post('/api/payments').set('Cookie', global.singin()).send({
//     token: 'laskdj',
//     orderId: order.id,
//   });
//   expect(401);
// });

// it('returns a 400 when purchasing an cancelled order', async () => {
//   const userId = mongoose.Types.ObjectId().toHexString();
//   const order = Order.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     userId,
//     version: 0,
//     price: 40,
//     status: OrderStatus.Cancelled,
//   });

//   await order.save();

//   await request(app)
//     .post('/api/payments')
//     .set('Cookie', global.singin(userId))
//     .send({
//       orderId: order.id,
//       token: 'lskjd',
//     })
//     .expect(400);
// });

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 40,
    status: OrderStatus.Created,
  });

  await order.save();
  console.log(order);
  const tes = global.signin(userId);
  console.log(tes);
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order._id,
    })
    .expect(201);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual('tok_visa');
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual('usd');
});
