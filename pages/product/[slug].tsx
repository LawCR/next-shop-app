import { useContext, useState } from "react";
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from 'next/router';
import { ShopLayout } from "../../components/layouts"
import { Grid, Box, Typography, Button, Chip } from '@mui/material';
import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { ICartProduct, IProduct, ISize } from "../../interfaces";
import { dbProducts } from "../../database";
import { CartContext } from "../../context";

interface Props {
  product: IProduct 
}

const ProductPage: NextPage<Props> = ({product}) => {

  const {addProductToCart} = useContext(CartContext)

  const router = useRouter()
  
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })

  const OnSelectedSize = (size:ISize) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size
    }))
  }

  const updatedQuantity = (newQuantity: number) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity: newQuantity, 
    }))
  }

  const onAddProduct = () => {
    if(!tempCartProduct.size) return

    // Llamar la accion del context para agregar al carrito
    addProductToCart(tempCartProduct)
    router.push('/cart')
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow 
            images={product.images}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* Titulos */}
            <Typography variant='h1' component='h1'>{ product.title }</Typography>
            <Typography variant='subtitle1' component='h2'>{ `$${product.price}` }</Typography>
            {/* Cantidad */}
            <Box sx={{my:2}}>
              <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <Typography variant='subtitle2'>Cantidad</Typography>
                <Typography variant='subtitle2'>Stock: <span style={{fontWeight: 'bold'}}>{product.inStock}</span></Typography>
              </Box>
              <ItemCounter 
                  currentValue={tempCartProduct.quantity}
                  updatedQuantity={updatedQuantity}
                  maxValue={product.inStock > 10 ? 10 : product.inStock}
              />
              <SizeSelector 
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                OnSelectedSize={OnSelectedSize}
              />
            </Box>

            {/* Agregar al carrito */}
            {
              (product.inStock > 0)
              ? (
                <Button color='secondary' className='circular-btn' onClick={ onAddProduct }>
                  {
                    tempCartProduct.size
                    ? 'Agregar al carrito'
                    : 'Seleccione una talla'
                  }
                </Button>
              )
              : (
                <Chip label='No hay disponibles' color='error' variant='outlined'  />
              )
            }
            <Box sx={{mt: 3}}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// * El SSR - no usar en lo posible
// export const getServerSideProps: GetServerSideProps = async ({params}) => {

//   const {slug = ''} = params as {slug: string}

//   const product = await dbProducts.getProductBySlug(slug)

//   if (!product) {
//     return {
//       redirect: {
//           destination: '/',
//           permanent: false,
//       }
//     }
//   }
  
//   return {
//     props: {
//       product
//     }
//   }
// }


export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductSlugs()
  return {
    paths: slugs.map(({slug}) => ({
      params: {slug}
    })),
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  
  const {slug = ''} = params as {slug: string}

  const product = await dbProducts.getProductBySlug(slug)

  if (!product) {
    return {
      redirect: {
          destination: '/',
          permanent: false,
      }
    }
  }

  return {
    props: {
      product
    },
    revalidate: 86400
  }
}

export default ProductPage