import type { NextPage, GetServerSideProps } from 'next'
import { Box, Divider, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { ProductList } from '../../components/products/ProductList';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';

interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
    cantidadProducts: number
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query, cantidadProducts }) => {
    
  return (
    <ShopLayout title={'Teslo Shop - Search'} pageDescription={'Busca tus productos de Teslo aqui'}>
        <Typography variant='h1' component='h1'>Buscar productos</Typography>

        {
            foundProducts
                ? (<Typography variant='h2' sx={{mb: 1}}>
                        Mostrando {`${cantidadProducts}`} resultados para: 
                        <Typography variant='h2' sx={{ml: 1}} component='span' color="secondary" textTransform='capitalize'>
                            { query }
                        </Typography>
                    </Typography>
                )
                : (
                    <>
                        <Box display='flex'>
                            <Typography variant='h2' sx={{mb: 1}}>No se encontraron resultados para:</Typography>
                            <Typography variant='h2' sx={{ml: 1}} color="secondary" textTransform='capitalize' >{query}</Typography>
                        </Box>
                        <Divider />
                        <Typography variant='h2' sx={{fontWeight: 22, fontSize: 18, my: 1}}>Otros productos que podrían gustarte:</Typography>
                    </>
                )
        }
        
        
        <ProductList products={products} />

    </ShopLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({params}) => {
    const { query = '' } = params as {query: string}

    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query)
    
    //* Si no hay productos
    const cantidadProducts = products.length
    const foundProducts = cantidadProducts > 0

    //* Retornamos otros productos
    if (!foundProducts) {
        // products = await dbProducts.getAllProducts()
        products = await dbProducts.getProductsByTerm('shirt')
    }

    return {
        props: {
            products,
            foundProducts,
            query,
            cantidadProducts
        }
    }
}

export default SearchPage
