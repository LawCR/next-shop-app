import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography, Grid, Chip, Link, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import NextLink from 'next/link';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100},
    { field: 'fullname', headerName: 'Nombre Completo', width: 300},
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si esta pagada la orden o no',
        width: 200,
        renderCell: (params: GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined' />
                    : <Chip color='error' label='No Pagada' variant='outlined' />
            )
        }
    },
    {
        field: 'orden',
        headerName: 'Ver orden',
        description: 'Ver los detalles del orden',
        width: 200,
        sortable: false,
        renderCell: (params: GridValueGetterParams) => {
            return (
                <NextLink href={`/orders/${params.row.id}`} passHref>
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

const rows = [
    { id: 1, paid: true, fullname: 'Alvaro Calderon' },
    { id: 2, paid: false, fullname: 'Alvaro Calderon 2' },
    { id: 3, paid: true, fullname: 'Alvaro Calderon 3' },
    { id: 4, paid: false, fullname: 'Alvaro Calderon 4' },
    { id: 5, paid: true, fullname: 'Alvaro Calderon 5' },
]

const HistoryPage = () => {
  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'>
        <Typography variant='h1' component='h1' >Historial de ordenes</Typography>

        <Grid container>
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

export default HistoryPage