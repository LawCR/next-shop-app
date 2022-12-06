import React from 'react'
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { Box, Button, CardMedia, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import useSWR from 'swr'
import { FullScreenLoading } from '../../../components/ui';
import { IProduct } from '../../../interfaces';
import { AdminLayout } from '../../../components/layouts';
import NextLink from 'next/link';

const columns: GridColDef[] = [
    { 
        field: 'img', 
        headerName: 'Imagen',
        renderCell: (params: GridValueGetterParams) => {
            return (
                <a href={`/product/${params.row.slug}`} target='_blank' rel="noreferrer">
                    <CardMedia 
                        component='img'
                        className='fadeIn'
                        alt={params.row.title}
                        // image={`/products/${params.row.img}`}
                        image={params.row.img}
                    />
                </a>
            )
        }
    },
    { 
        field: 'title', 
        headerName: 'Titulo', 
        width: 350,
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink href={`/admin/products/${params.row.slug}`} passHref>
                    <Link underline='always'>
                        {params.row.title}
                    </Link>
                </NextLink>
            )
        }
    },
    { field: 'gender', headerName: 'Género' },
    { field: 'type', headerName: 'Tipo' },
    { field: 'inStock', headerName: 'Inventario' },
    { field: 'price', headerName: 'Precio' },
    { field: 'sizes', headerName: 'Tallas', width: 250 },
]

const ProductsPage = () => {
    const {data, error} = useSWR<IProduct[]>('/api/admin/products')
    if (!data && !error) return <FullScreenLoading />

    const rows = data!.map( product => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug
    }))

    return (
        <AdminLayout 
            title={`Productos (${data?.length})`} subTitle={'Mantenimiento de productos'}
            icon={<CategoryOutlined />}
        >
            <Box display='flex' justifyContent='end' sx={{mb: 2}}>
                <Button
                    startIcon={<AddOutlined />}
                    color='secondary'
                    href='/admin/products/new'
                >
                    Crear Producto
                </Button>
            </Box>
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

export default ProductsPage