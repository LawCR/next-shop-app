import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from "next/link"
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';
import Cookies from 'js-cookie';
import { CartList, OrderSummary, OrderAddress } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"
import { FullScreenLoading } from '../../components/ui';
import { CartContext } from '../../context';

const SummaryPage = () => {

    const router = useRouter()
    const [isPosting, setIsPosting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext)

    useEffect(() => {
        if (!Cookies.get('firstName')) {
            router.replace('/checkout/address')
        }
    }, [router])

    if (!shippingAddress) {
        return (
            <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
                <FullScreenLoading />
            </ShopLayout>
        )
    }

    const onCreateOrder = async() => {
        setIsPosting(true)
        // message: error | orderId
        const { hasError, message } = await createOrder()
        if (hasError) {
            setIsPosting(false)
            setErrorMessage(message)
            return
        }
        
        router.replace(`/orders/${message}`)
    }

    return (
        <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden'>
            <Typography variant='h1' component='h1'>Resumen de la Orden</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2' textAlign='center' fontWeight='bold'>Resumen ({numberOfItems} {numberOfItems === 1 ? 'producto' : 'productos'})</Typography>
                            <Divider sx={{my: 1}}  />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref>
                                    <Link underline='hover' color='secondary' sx={{alignSelf: 'center'}}>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Divider sx={{my: 1}}  />
                            <OrderAddress shippingAddress={shippingAddress} />
                            <Divider sx={{my: 1}}  />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref>
                                    <Link underline='hover' color='secondary'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{mt: 3}} display='flex' flexDirection='column'>
                                <Button 
                                    color="secondary" 
                                    className='circular-btn' 
                                    fullWidth
                                    onClick={onCreateOrder}
                                    disabled={isPosting}
                                >
                                    Confirmar Orden
                                </Button>

                                <Chip 
                                    color='error' label={errorMessage} 
                                    sx={{mt: 2, display: errorMessage ? 'flex' : 'none'}}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage