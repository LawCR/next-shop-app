import { Grid, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import { CartContext } from '../../context';
import { IOrder } from '../../interfaces';
import { currency } from '../../utils'

interface Props {
    order?: IOrder
}

export const OrderSummary: FC<Props> = ({order}) => {

    const {numberOfItems, subTotal, total, tax} = useContext(CartContext)

    const _numberOfItems = order?.numberOfItems ? order.numberOfItems : numberOfItems
    const _subTotal = order?.subTotal ? order.subTotal : subTotal
    const _total = order?.numberOfItems ? order.total : total
    const _tax = order?.numberOfItems ? order.tax : tax

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography fontWeight='bold'>No. Productos</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{_numberOfItems} {_numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography fontWeight='bold'>SubTotal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{ currency.format(_subTotal) }</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography fontWeight='bold'>Impuestos ({Number(process.env.NEXT_PUBLIC_TAX_RATE)*100}%)</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(_tax)}</Typography>
            </Grid>

            <Grid item xs={6} sx={{mt: 2}}>
                <Typography variant='subtitle1'>Total:</Typography>
            </Grid>
            <Grid item xs={6} sx={{mt: 2}} display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>{currency.format(_total)}</Typography>
            </Grid>
        </Grid>
    )
}
