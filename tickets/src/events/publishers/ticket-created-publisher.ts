import {Publisher, Subjects, TicketCreatedEvent } from '@moudtickets/common';


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  // we don't want to change the value of subject! 
  readonly subject =  Subjects.TicketCreated;

} 

