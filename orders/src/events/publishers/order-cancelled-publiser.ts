import { OrderCancelledEvent, Publisher, Subjects } from "@akyshtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
}