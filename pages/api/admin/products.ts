import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '../../../interfaces/products';
import { Product } from '../../../models';
import { db } from '../../../database';
import { isValidObjectId } from 'mongoose';
import {v2 as cloudinary} from 'cloudinary'
cloudinary.config(process.env.CLOUDINARY_URL || '')

type Data = 
| { message: string }
| IProduct[]
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res)
            
        case 'PUT':
            return updateProduct(req, res)
            
        case 'POST':
            return createProduct(req, res)

    
        default:
            return res.status(40).json({ message: 'Método de servicio no disponible' })
    }
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect()

    const products = await Product.find()
            .sort({title: 'asc'})
            .lean()

    await db.disconnect()
    
    //* Procesamiento de las imagenes cuando lo subamos al server
    const updatedProducts = products.map(product => {
        product.images = product.images.map((image: string) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })
    res.status(200).json(updatedProducts)
}
const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', images = []} = req.body as IProduct

    if (!isValidObjectId(_id)) {
        return res.status(400).json({message: 'El id del product no es valido'})
    }

    if (images.length < 2) {
        return res.status(400).json({message: 'El producto debe tener al menos 2 imagenes'})
    }

    try {
        await db.connect()
        const product = await Product.findById(_id)
        if (!product) {
            await db.disconnect()
            return res.status(400).json({message: 'El producto con ese ID no existe'})
        }

        //* Eliminar fotos en Cloudinary
        product.images.forEach(async (image: string) => {
            if (!images.includes(image)) {
                const [fileId, extension] = image.substring(image.lastIndexOf('/') + 1).split('.')
                await cloudinary.uploader.destroy(fileId)
            }
        })

        await product.update(req.body)
        await db.disconnect()

        return res.status(200).json(product)
    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(400).json({message: 'Revisar la consola del servidor'})

    }
}

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { images = [] } = req.body as IProduct

    if (images.length < 2) {
        return res.status(400).json({message: 'El producto debe tener al menos 2 imagenes'})
    }

    // TODO: Posiblemente tendremos un localhost:3000/products/asdasd.jpg

    try {
        await db.connect()
        const productInDB = await Product.findOne({slug: req.body.slug})
        if (productInDB) {
            await db.disconnect()
            return res.status(400).json({message: 'Ya existe un producto con ese slug'})
        }

        const product = new Product(req.body)
        await product.save()
        await db.disconnect()

        return res.status(201).json(product)

    } catch (error) {
        console.log(error)
        await db.disconnect()
        return res.status(400).json({message: 'Revisar la consola del servidor'})
    }
}

