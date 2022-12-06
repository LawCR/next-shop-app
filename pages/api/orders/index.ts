import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Order, Product } from '../../../models';

type Data = 
| { message: string }
| { message: string, order: IOrder }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return createOrder(req, res)
    }


    res.status(200).json({ message: 'Example' })
}

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const {orderItems, total} = req.body as IOrder

    //* Verificar que tengamos un usuario
    const session: any = await getSession({ req })
    if (!session) {
        return res.status(401).json({ message: 'Debe de estar autenticado para realizar la orden' })
    }

    //* Crear un arreglo con los productos que se quiere ordenar
    const productsIds = orderItems.map((product) => product._id)
    await db.connect()

    //* Consulta: Buscar todos los productos cuyo _id exista en(in) mi array de productosIds
    const dbProducts = await Product.find({ _id: {$in: productsIds} })

    try {
        //* Revisamos que el total coincida con el backend (seguridad)
        const backendSubTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find(product => product.id === current._id)?.price
            if (!currentPrice) throw new Error('Verifique el carrito de nuevo, product no existe')
            

            return ( currentPrice * current.quantity) + prev 
        }, 0)
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0)
        const backendTotal = backendSubTotal * ( taxRate + 1 )
        if (total !== backendTotal) throw new Error('El total no coincide con lo ordenado')

        //* Proceso realizado correctamente
        const userId = session.user._id
        const newOrder = new Order({ ...req.body, isPaid: false, user: userId })
        newOrder.total = Math.round( newOrder.total * 100 ) / 100
        await newOrder.save()
        await db.disconnect()
        
        return res.status(201).json({ message: 'Orden creada correctamente', order: newOrder })
    } catch (error: any) {
        await db.disconnect()
        res.status(400).json({ message: error.message || 'Revise logs del servidor' })
    }
}
