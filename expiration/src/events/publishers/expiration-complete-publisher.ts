import { Publisher } from "@moudtickets/common";
import { ExpirationCompleteEvent, Subjects } from "@moudtickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
