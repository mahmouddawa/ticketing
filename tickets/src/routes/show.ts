import express, { Request, Response } from 'express';
import { NotFoundError } from '@moudtickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    // testing the PR
    throw new NotFoundError();
  }

  res.send(ticket);
});

export { router as showTicketRouter };
