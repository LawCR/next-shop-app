import { Grid, Typography } from '@mui/material'
import React, { FC } from 'react'
import { ShippingAddress } from '../../interfaces'
import { countries } from '../../utils'

interface Props {
    shippingAddress: ShippingAddress
}

export const OrderAddress: FC<Props>  = ({shippingAddress}) => {

    const { firstName, lastName, address, address2, city, country, phone, zip } = shippingAddress

    const countryData = countries.find(c => c.code === country)

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography fontWeight='bold'>Nombre Completo</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{`${firstName} ${lastName}`}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography fontWeight='bold'>Dirección</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{address}</Typography>
            </Grid>

            <Grid item xs={6} sx={{display: address2 ? 'flex' : 'none'}}>
                <Typography fontWeight='bold'>Dirección 2</Typography>
            </Grid>
            <Grid item xs={6} sx={{display: address2 ? 'flex' : 'none'}} justifyContent='end'>
                <Typography>{address2 ? `${address2}` : ''}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography fontWeight='bold'>Ciudad</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{city}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography fontWeight='bold'>Código Postal</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{zip}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography fontWeight='bold'>País</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{countryData?.name}</Typography>
            </Grid>

            <Grid item xs={6}>
                <Typography fontWeight='bold'>Teléfono</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{phone}</Typography>
            </Grid>
        </Grid>
    )
}
