import { Publisher, Subjects, TicketCreatedEvent } from "@akyshtickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}