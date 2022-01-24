import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

stan.on('connect', async () => {
    console.log('Publisher connected to NATS');

    const data = {
        id: '123',
        title: 'concert',
        price: 30,
        userId: 'tes'
    };

    const publisher = new TicketCreatedPublisher(stan);
    try {
        await publisher.publish(data);
        console.log('yaaaaah');
    } catch (err) {
        console.log(err);
    }
});