import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography, Grid, Chip, Link, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', flex: 0.1, align: 'center', headerAlign: 'center' },
    { field: 'firstName', headerName: 'Nombres', flex: 0.20, align: 'center', headerAlign: 'center'},
    { field: 'lastName', headerName: 'Apellidos', flex: 0.20, align: 'center', headerAlign: 'center' },
    {
        field: 'purchaseDate',
        headerName: 'Fecha',
        description: 'Fecha de realizada la orden',
        flex: 0.10,
        align: 'center', headerAlign: 'center',
        renderCell: (params: GridValueGetterParams) => {
            let date = new Date(params.row.purchaseDate)
            let day = date.getDate()
            let month = date.getMonth() + 1
            let year = date.getFullYear()

            const dateFormat = (monthNumber: number) => monthNumber < 10 ? `${day}/0${month}/${year}` : `${day}/${month}/${year}`

            return (
                <p>{dateFormat(month)}</p>
            )
        }
    },
    {
        field: 'total',
        headerName: 'Total de la orden',
        description: 'Muestra información si esta pagada la orden o no',
        flex: 0.10,
        align: 'center', headerAlign: 'center',
        renderCell: (params: GridValueGetterParams) => {
            return (
                <p style={{color: 'green'}}>$ {params.row.total.toFixed(2)}</p>
            )
        }
    },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si esta pagada la orden o no',
        // width: 200,
        flex: 0.10,
        align: 'center', headerAlign: 'center',
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined' />
                    : <Chip color='error' label='No Pagada' variant='outlined' />
            )
        }
    },
    {
        field: 'orderId',
        headerName: 'Ver orden',
        description: 'Ver los detalles del orden',
        // width: 200,
        flex: 0.10,
        sortable: false,
        align: 'center', headerAlign: 'center',
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink href={`/orders/${params.row.orderId}`} passHref>
                    <Link>
                        <Button variant='outlined' color='secondary'>
                            Ver orden
                        </Button>
                    </Link>
                </NextLink>
            )
        }
    },
]

interface Props {
    orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({orders}) => {

    const rows = orders.map((order, index) => ({
        id: index + 1,
        paid: order.isPaid,
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        orderId: order._id,
        purchaseDate: order.createdAt,
        total: order.total
    }))

    
    return (
        <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'>
            <Typography variant='h1' component='h1' >Historial de ordenes</Typography>

            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{height: 650, width: '100%', textAlign: 'center'}}>
                    <DataGrid 
                        columns={columns} 
                        rows={rows}           
                        pageSize={10}
                        rowsPerPageOptions={[10]}                
                    />
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session: any = await getSession({ req })

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/history`,
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id)
    
    return {
        props: {
            orders
        }
    }
}

export default HistoryPage