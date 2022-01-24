import { Publisher, Subjects, TicketUpdatedEvent } from "@akyshtickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
}