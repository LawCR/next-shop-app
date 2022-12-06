import React from 'react'
import { AdminLayout } from '../../components/layouts'
import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr';
import { IOrder, IUser } from '../../interfaces';
import { FullScreenLoading } from '../../components/ui';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 220 },
    { field: 'email', headerName: 'Correo', width: 280 },
    { field: 'name', headerName: 'Nombre completo', width: 350 },
    { field: 'createdAt', headerName: 'Creada en', width: 180, 
        renderCell: (params: GridValueGetterParams) => {
        return <p>{new Date(params.row.createdAt).toLocaleDateString()} </p>
    } },
    { field: 'numberOfProducts', headerName: 'N° Productos', width: 120, align: 'center' },
    { field: 'total', headerName: 'Monto total', width: 120 },
    { 
        field: 'isPaid', 
        headerName: 'Pagada', 
        width: 130,
        renderCell: (params: GridValueGetterParams) => {
            return params.row.isPaid
                ? (<Chip variant='outlined' label='Pagada' color='success' />)
                : (<Chip variant='outlined' label='Pendiente' color='error' />)
        }
    },
    { 
        field: 'check', 
        headerName: 'Ver orden', 
        width: 120,
        renderCell: (params: GridValueGetterParams) => {
            return (
                <a href={`/admin/orders/${params.row.id}`} target='_blank' rel="noreferrer">
                    Ver orden
                </a>
            )
        }
    },
]

const OrdersPage = () => {
    const {data, error} = useSWR<IOrder[]>('/api/admin/orders')
    if (!data && !error) return <FullScreenLoading />

    const rows = data!.map( order => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        numberOfProducts: order.numberOfItems,
        createdAt: order.createdAt,
    }))

    return (
        <AdminLayout 
            title={'Ordenes'} subTitle={'Mantenimiento de ordenes'}
            icon={<ConfirmationNumberOutlined />}
        >
            <Grid container className='fadeIn' >
                <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                    <DataGrid 
                        columns={columns} 
                        rows={rows}           
                        pageSize={10}
                        rowsPerPageOptions={[10]}       
                    />
                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default OrdersPage