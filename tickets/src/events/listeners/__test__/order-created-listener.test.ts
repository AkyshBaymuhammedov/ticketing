import { OrderCreatedEvent, OrderStatus } from "@akyshtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import mongoose from 'mongoose';
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: 'tst'
    });
    await ticket.save();

    // Create a fake data object
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: "yolo",
        expiresAt: "dwa",
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };

    // Create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, ticket, msg };
};

it('sets the userId of the ticket', async () => {
    const { listener, data, ticket, msg } = await setup();
    await listener.onMessage(data, msg);

    const updateTicket = await Ticket.findById(ticket.id);
    expect(updateTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
    const { listener, data, ticket, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(ticketUpdatedData.orderId).toEqual(data.id);
});