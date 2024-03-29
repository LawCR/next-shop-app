import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces';
import { db } from '../../../database';
import {Product} from '../../../models';

type Data = 
| { message: string }
| IProduct


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProductBySlug(req, res)
    
        default:
            return res.status(400).json({message: `Bad request, method ${req.method} does not exist`  });
    }
}

const getProductBySlug = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const {slug} = req.query

    await db.connect()
    const product = await Product.findOne({slug}).lean()
    await db.disconnect()

    if (!product) {
        return res.status(400).json({message: 'No hay producto: ' + slug})
    }

    product.images = product.images.map((image: string) => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
    })
    return res.status(200).json(product)
}
