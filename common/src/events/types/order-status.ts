export enum OrderStatus {
  // when the order has been created but the ticket is to trying to order has bot been reserved
  Created = 'created',

  // the ticket the order is trying to reserve has already been reserved 
  // when the user has cancelled the request.
  // if the order expires before payment

  Cancelled = 'cancelled',
  // the order has been successfully reserved the ticket
  
  AwaitaingPayment = 'awaiting:payment',
  // The order reserved the ticket and the user has provided payment successfully
  Complete = 'complete'

}