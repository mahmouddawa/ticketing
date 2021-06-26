import {Publisher, TicketUpdatedEvent, Subjects} from '@moudtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}