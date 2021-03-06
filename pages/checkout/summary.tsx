import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link } from '@mui/material';
import NextLink from "next/link"
import { CartList, OrderSummary } from "../../components/cart"
import { ShopLayout } from "../../components/layouts"


const SummaryPage = () => {
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
                            <Button color="secondary" className='circular-btn' fullWidth>
                                Confirmar Orden
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage