import { Typography, Grid, Link, CardMedia, Box, Button } from '@mui/material';
import NextLink from "next/link";
import { FC } from "react"
import { initialData } from '../../database/products';
import { ItemCounter } from '../ui/ItemCounter';

interface Props {
    editable?: boolean;
}

const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
]

export const CartList: FC<Props> = ({editable = false}) => {

    return (
        <>
            {
                productsInCart.map( product => (
                    <Grid container spacing={2} key={product.slug}>
                        <Grid item xs={3}>
                            {/* TODo: llevar a la pagina del product */}
                            <NextLink href='/product/slug' passHref>
                                <Link underline='none'>
                                    <CardMedia 
                                        image={`/products/${product.images[0]}`}
                                        component='img'
                                    />
                                </Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={7}>
                            <Box display='flex' flexDirection='column'>
                                <Typography variant='body1' >{product.title}</Typography>
                                <Typography variant='body1' >Talla: <strong>M</strong></Typography>
                                {
                                    editable
                                    ? <ItemCounter />
                                    : <Typography variant='h5' >3 items</Typography>
                                }
                            </Box>
                        </Grid>
                        <Grid item xs={2} display='flex' alignItems='center' flexDirection='column' >
                            <Typography variant='subtitle1'>{`$${product.price}`} </Typography>
                            {
                                editable && (
                                    <Button variant='text' color='secondary'>
                                        Remover
                                    </Button>
                                )
                            }
                            
                        </Grid>
                    </Grid>
                ))
            }
        </>
    ) 
}
