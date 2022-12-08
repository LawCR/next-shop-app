import { getSession } from "next-auth/react";
import { GetServerSideProps, NextPage } from 'next';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { Typography, Grid, Card, CardContent, Divider, Box, Chip, CircularProgress } from '@mui/material';
import { CartList, OrderAddress, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"
import {CreditCardOffOutlined, CreditScoreOutlined} from '@mui/icons-material'
import { dbOrders } from "../../database";
import { IOrder } from '../../interfaces';
import { tesloApi } from "../../axiosApi";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
    order: IOrder
}

type OrderResponseBody = {
    id: string;
    status: "COMPLETED" | "SAVED" | "APPROVED" | "VOIDED" | "PAYER_ACTION_REQUIRED";
}

const OrderPage: NextPage<Props> = ({order}) => {

    const router = useRouter()
    const { shippingAddress } = order
    const [isPaying, setIsPaying] = useState(false)

    // Otra opción en vez de recargar podriamos actualizar el estado de la orden
    const onOrderCompleted = async( details: OrderResponseBody ) => {
        if (details.status !== 'COMPLETED') return alert('Hubo un error, no se completo el pago en Paypal')
        setIsPaying(true)
        try {
            const { data } = await tesloApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id
            })

            router.reload()
        } catch (error) {
            setIsPaying(false)
            console.log(error)
            alert('Hubo un error, no se completo el pago en Paypal')
        }
    }

    return (
        <ShopLayout title='Resumen de la orden' pageDescription='Resumen de la orden'>
            <Typography variant='h1' component='h1'>Orden: {order._id}</Typography>

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

                            <Divider sx={{my: 1}}  />
                            <Box sx={{mt: 3}} display='flex' flexDirection='column'>

                                <Box 
                                    display='flex' 
                                    justifyContent='center' 
                                    className="fadeIn"
                                    sx={{display: isPaying ? 'flex' : 'none'}}
                                >
                                    <CircularProgress />
                                </Box>
                                <Box sx={{display: isPaying ? 'none' : 'flex', flex: 1}} flexDirection='column'>
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
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: `${order.total}`,
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details) => {
                                                        onOrderCompleted(details)
                                                        // console.log({details})
                                                        // const name = details.payer.name!.given_name;
                                                        // alert(`Transaction completed by ${name}`);
                                                    });
                                                }}
                                            />
                                        )
                                    }
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    const { id = '' } = query
    const session: any = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            }
        }
    }

    const order = await dbOrders.getOrderByid(id.toString())

    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false,
            }
        }
    }

    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: `/orders/history`,
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