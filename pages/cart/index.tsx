import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ShopLayout } from '../../components/layouts';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, CircularProgress } from '@mui/material';
import { CartList } from '../../components/cart/CartList';
import { OrderSummary } from '../../components/cart/OrderSummary';
import { CartContext } from '../../context';
import { FullScreenLoading } from '../../components/ui';

const CartPage = () => {
    
    const {isLoaded, cart, numberOfItems} = useContext(CartContext)
    const router = useRouter()

    useEffect(() => {
        if (isLoaded && cart.length === 0) {
            router.replace('/cart/empty')
        }
            
    }, [isLoaded, cart, router])

    if (!isLoaded || cart.length === 0) {
        return (
            <ShopLayout title={`Carrito - ${numberOfItems}`} pageDescription='Carrito de compras de la tienda'>
                <FullScreenLoading />
            </ShopLayout>
        )
    }

    return (
        <ShopLayout title={`Carrito - ${numberOfItems}`} pageDescription='Carrito de compras de la tienda'>
            <Typography variant='h1' component='h1'>Carrito</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                    <CartList editable />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>
                            <Divider sx={{my: 1}}  />

                            {/* Order Summary */}
                            <OrderSummary />
                            <Box sx={{mt: 3}}>
                                <Button 
                                    color="secondary" 
                                    className='circular-btn' 
                                    fullWidth
                                    href='/checkout/address'
                                >
                                    Checkout
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}


export default CartPage