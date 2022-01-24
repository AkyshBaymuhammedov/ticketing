import { PaymentCreatedEvent, Publisher, Subjects } from "@akyshtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
}