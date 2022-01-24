import { Listener } from "../../../common/src/events/base-listener";
import nats from 'node-nats-streaming';
import { TicketCreatedEvent } from "@akyshtickets/common";
import { Subjects } from "../../../common/src/events/subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'product-service';

    onMessage(data: TicketCreatedEvent['data'], msg: nats.Message): void {
        console.log('Event data!', data);

        msg.ack();
    }

} 