import { GetServerSideProps, NextPage } from 'next';
import { Typography, Grid, Card, CardContent, Divider, Box, Chip } from '@mui/material';
import {AirplaneTicket, AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined} from '@mui/icons-material'
import { AdminLayout, ShopLayout } from "../../../components/layouts";
import { CartList, OrderAddress, OrderSummary } from "../../../components/cart";
import { dbOrders } from "../../../database";
import { IOrder } from "../../../interfaces";

interface Props {
    order: IOrder
}


const OrderPage: NextPage<Props> = ({order}) => {

    const { shippingAddress } = order

    return (
        <AdminLayout title='Resumen de la orden' subTitle={`Orden N°${order._id}`} icon={<AirplaneTicketOutlined />} >
            {/* <Typography variant='h1' component='h1'>Orden: {order._id}</Typography> */}

            {
                order.isPaid ? (
                    <Chip 
                        sx={{my: 2}}
                        label='Orden ya fue Pagada'
                        variant='outlined'
                        color='success'
                        icon={<CreditScoreOutlined /> }
                    />
                ) : (
                    <Chip 
                        sx={{my: 2}}
                        label='Pendiente de pago'
                        variant='outlined'
                        color='error'
                        icon={<CreditCardOffOutlined /> }
                    /> 
                )
            }
            
            <Grid container spacing={2} className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    <CartList products={order.orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2' textAlign='center' fontWeight='bold'>
                                Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'} )
                            </Typography>

                            <Divider sx={{my: 1}} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Divider sx={{my: 1}}  />
                            <OrderAddress shippingAddress={shippingAddress} />
                            <Divider sx={{my: 1}}  />

                            <OrderSummary order={order} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    const { id = '' } = query

    const order = await dbOrders.getOrderByid(id.toString())

    if (!order) {
        return {
            redirect: {
                destination: `/admin/orders`,
                permanent: false,
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage