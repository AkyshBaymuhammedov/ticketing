import { OrderCancelledEvent, OrderStatus } from "@akyshtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose';
import { Ticket } from "../../../models/ticket";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = new mongoose.Types.ObjectId().toHexString();
    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'tst'
    });
    ticket.set({ orderId });
    await ticket.save();

    // Create a fake data object
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        ticket: {
            id: ticket.id
        },
        version: 0
    };

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, ticket, msg };
};

it('updates the ticket, publishes an event and acks the message', async () => {
    const { listener, data, ticket, msg } = await setup();
    await listener.onMessage(data, msg);

    const updateTicket = await Ticket.findById(ticket.id);
    expect(updateTicket!.orderId).toBeUndefined();

    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
