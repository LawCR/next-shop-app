import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number;
    paidOrders: number; // isPaid = true
    notPaidOrders: number;
    numberOfClients: number; // role = client
    numberOfProducts: number;
    productsWithNoInventary: number; // stock = 0
    lowInventory: number; // stock <= 10
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    await db.connect()
    const [
        numberOfOrders, 
        paidOrders, 
        numberOfClients, 
        numberOfProducts, 
        productsWithNoInventary, 
        lowInventory
    ] = await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ isPaid: true }),
        User.countDocuments({ role: 'client' }),
        Product.countDocuments(),
        Product.countDocuments({ inStock: 0  }),
        Product.countDocuments({ inStock: { $lte: 10 } }),
    ])

    await db.disconnect()

    res.status(200).json({ 
        numberOfOrders,
        paidOrders,
        notPaidOrders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventary,
        lowInventory, 
    })
}