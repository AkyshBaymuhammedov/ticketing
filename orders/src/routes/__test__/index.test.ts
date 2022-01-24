import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const buildTicket = async (title: string, price: number) => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: title,
        price: price
    });
    await ticket.save();

    return ticket;
};

it('fetches orders for a particular user', async () => {
    const ticket = await buildTicket('Concert', 10);
    const ticket1 = await buildTicket('Concert1', 20);
    const ticket2 = await buildTicket('Concert2', 30);

    const user1 = global.signup();
    const user2 = global.signup();

    await request(app)
        .post('/api/orders')
        .set('Cookie', user1)
        .send({ ticketId: ticket.id })
        .expect(201);

    const { body: order1 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket1.id })
        .expect(201);

    const { body: order2 } = await request(app)
        .post('/api/orders')
        .set('Cookie', user2)
        .send({ ticketId: ticket2.id })
        .expect(201);

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', user2)
        .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);
    expect(response.body[0].ticket.id).toEqual(ticket1.id);
    expect(response.body[1].ticket.id).toEqual(ticket2.id);
});