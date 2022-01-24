import { Publisher, TicketCreatedEvent } from "@akyshtickets/common";
import { Subjects } from "../../../common/src/events/subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;

}