import { Ticket } from "../ticket";


it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });
    await ticket.save();

    const ticket1 = await Ticket.findById(ticket.id);
    const ticket2 = await Ticket.findById(ticket.id);

    ticket1!.set({ price: 10 });
    ticket2!.set({ price: 15 });

    await ticket1!.save();

    //this should fail with version error
    try {
        await ticket2!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach to this point');
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 5,
        userId: '123'
    });
    await ticket.save();
    expect(ticket.version).toEqual(0);

    ticket.set({ price: 15 });
    await ticket.save();
    expect(ticket.version).toEqual(1);

    await ticket.save();
    expect(ticket.version).toEqual(2);
});