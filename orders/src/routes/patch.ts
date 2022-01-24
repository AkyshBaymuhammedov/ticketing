import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@akyshtickets/common';
import express, { Request, Response } from 'express';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publiser';
import { Order } from '../models/order';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        } 
    });

    res.status(200).send(order);
});

export { router as deleteOrderRouter };