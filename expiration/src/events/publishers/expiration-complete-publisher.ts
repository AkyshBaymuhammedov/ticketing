import { ExpirationCompleteEvent, Publisher, Subjects } from "@akyshtickets/common";

export class ExpiratonCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}