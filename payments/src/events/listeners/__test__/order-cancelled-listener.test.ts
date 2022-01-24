import { OrderCancelledEvent, OrderStatus } from "@akyshtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose';
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        userId: 'test',
        version: 0,
        price: 10
    });
    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version + 1,
        ticket: {
            id: "test"
        }
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return { listener, data, order, msg };
};

it('updates the status of the order', async () => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});