import { db } from "./"
import Product from '../models/Product';
import { IProduct } from "../interfaces";

export const getProductBySlug = async(slug: string): Promise<IProduct | null> => {
    await db.connect()

    const product = await Product.findOne({slug}).lean()

    await db.disconnect()

    if (!product) {
        return null
    }

    //* Procesamiento de las imagenes cuando lo subamos al server (Solo si se tiene imagenes en filesystem)
    product.images = product.images.map((image: string) => {
        return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
    })

    // Para hacer un parseo del id en forma de object
    return JSON.parse( JSON.stringify( product ) )
}

interface ProductSlug {
    slug: string;
}
export const getAllProductSlugs = async(): Promise<ProductSlug[]> => {
    await db.connect()

    const slugs = await Product.find().select('slug -_id').lean()

    await db.disconnect()

    return slugs
}

export const getProductsByTerm = async(term: string): Promise<IProduct[]> => {
    term = term.toString().toLowerCase()

    await db.connect()

    const products = await Product.find({
        $text: { $search: term}
    })
    .select('title images price inStock slug -_id')
    .lean()

    await db.disconnect()

    //* Procesamiento de las imagenes cuando lo subamos al server
    const updatedProducts = products.map(product => {
        product.images = product.images.map((image: string) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })

    return updatedProducts
}

export const getAllProducts = async(): Promise<IProduct[]> => {
    await db.connect()

    const products = await Product.find().lean()

    await db.disconnect()

    //* Procesamiento de las imagenes cuando lo subamos al server
    const updatedProducts = products.map(product => {
        product.images = product.images.map((image: string) => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        })

        return product
    })

    return JSON.parse( JSON.stringify( updatedProducts ) ) 
}