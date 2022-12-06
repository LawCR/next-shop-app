import { isValidObjectId } from "mongoose";
import { Order } from '../models';
import { db } from '.';
import { IOrder } from '../interfaces';

//* Retorna la orden por id
export const getOrderByid = async (id: string): Promise<IOrder | null> => {

    if (!isValidObjectId(id)) return null

    await db.connect()
    const order = await Order.findById(id).lean()
    await db.disconnect()

    if (!order) return null

    return JSON.parse(JSON.stringify(order))
}

//* Retorna todas las ordenes de un usuario (id)
export const getOrdersByUser = async (userId: string): Promise<IOrder[]> => {
    
        if (!isValidObjectId(userId)) return []
    
        await db.connect()
        //* Buscar las ordenes cuyo usuario sea igual al userId del usuario autenticado
        const orders = await Order.find({ user: userId }).lean()
        
        await db.disconnect()
        if (!orders) return []
    
        return JSON.parse(JSON.stringify(orders))
}