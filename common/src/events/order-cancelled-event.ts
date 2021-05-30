import { Subjects} from './subjects';



export interface OrderCancelledEvent {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    ticket: {
      id:string;
    }

  }
}


// we need to make some decisions about how much data need to be distributed between services
//do we share the max or min amount of data? 
// here there are minimum amount of data.. i am sharing the id of an order and the ticket number
// so if we want to know the price of the ticket we need to comeback here and add 
// the price property and republish the library.. 
