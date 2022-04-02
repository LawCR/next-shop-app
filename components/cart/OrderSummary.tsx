import { Grid, Typography } from '@mui/material';


export const OrderSummary = () => {
  return (
    <Grid container>
        <Grid item xs={6}>
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>3 items</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>SubTotal</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{`$${185.50}`}</Typography>
        </Grid>

        <Grid item xs={6}>
            <Typography>Impuestos (15%)</Typography>
        </Grid>
        <Grid item xs={6} display='flex' justifyContent='end'>
            <Typography>{`$${35.50}`}</Typography>
        </Grid>

        
        <Grid item xs={6} sx={{mt: 2}}>
            <Typography variant='subtitle1'>Total:</Typography>
        </Grid>
        <Grid item xs={6} sx={{mt: 2}} display='flex' justifyContent='end'>
            <Typography variant='subtitle1'>{`$${150.00}`}</Typography>
        </Grid>
    </Grid>
  )
}
