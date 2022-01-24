import request from 'supertest';
import { app } from '../../app';
import { OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    });
    ticket.save();

    const user = global.signup();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    const { body: updatedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(updatedOrder.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20
    });
    ticket.save();

    const user = global.signup();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticket.id })
        .expect(201);

    await request(app)
        .patch(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    const { body: updatedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});