import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip } from '@mui/material';
import NextLink from "next/link"
import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"

import {CreditCardOffOutlined, CreditScoreOutlined} from '@mui/icons-material'


const OrderPage = () => {
  return (
    <ShopLayout title='Resumen de la orden 16135' pageDescription='Resumen de la orden'>
        <Typography variant='h1' component='h1'>Orden: ABC123</Typography>

        {/* <Chip 
            sx={{my: 2}}
            label='Pendiente de pago'
            variant='outlined'
            color='error'
            icon={<CreditCardOffOutlined /> }
        /> */}
        <Chip 
            sx={{my: 2}}
            label='Orden ya fue Pagada'
            variant='outlined'
            color='success'
            icon={<CreditScoreOutlined /> }
        />

        <Grid container spacing={2}>
            <Grid item xs={12} sm={7}>
                <CartList />
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen (3 productos)</Typography>
                        <Divider sx={{my: 1}}  />

                        <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            <NextLink href='/checkout/address' passHref>
                                <Link underline='hover' color='secondary' sx={{alignSelf: 'center'}}>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        
                        <Typography>Alvaro Calderon</Typography>
                        <Typography>Av Central</Typography>
                        <Typography>Lima, Villa el Salvador 152</Typography>
                        <Typography>Perú</Typography>
                        <Typography>+51 996633463</Typography>
                        
                        <Divider sx={{my: 1}}  />

                        <Box display='flex' justifyContent='end'>
                            <NextLink href='/cart' passHref>
                                <Link underline='hover' color='secondary'>
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <OrderSummary />

                        <Box sx={{mt: 3}}>
                            {/* TODO */}
                            <h1>Pagar</h1>
                            <Chip 
                                sx={{my: 2}}
                                label='Orden ya fue Pagada'
                                variant='outlined'
                                color='success'
                                icon={<CreditScoreOutlined /> }
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default OrderPage