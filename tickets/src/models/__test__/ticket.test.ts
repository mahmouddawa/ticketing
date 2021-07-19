import { request } from "express";
import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async (done) => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '1234',
  });

  await ticket.save();
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  firstInstance!.set({ price: 30 });
  secondInstance!.set({ price: 50 });

  await firstInstance!.save();
  // jest does not support TS with the .toThrow() function.
  try {
    await secondInstance!.save();
  } catch (err) {
    // if you upated jest, in the new version you will get this error:
    //Test functions cannot both take a 'done' callback and return something. Either use a 'done' callback, or return a promise.
    //just remove the done() in the next line return nothing
    return done();
  }

  throw new Error('this error should not show up, must enter the catch');
});

it("increments the version number on multiple saves", async () => {
  const ticket = Ticket.build({
    title: "new title",
    price: 23,
    userId: "1234",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
