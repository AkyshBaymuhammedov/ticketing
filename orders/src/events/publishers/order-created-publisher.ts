import { OrderCreatedEvent, Publisher, Subjects } from "@akyshtickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
}