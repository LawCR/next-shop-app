import React from 'react'
import { AuthLayout } from '../../components/layouts'
import { Box, Grid, Typography, TextField, Button, Link } from '@mui/material';
import NextLink from 'next/link';

const LoginPage = () => {
  return (
    <AuthLayout title='Ingresar' >
        <Box sx={{width: 350, paading: '10px 20px'}}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant='h1' component='h1' textAlign='center'>Iniciar Sesión</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Correo' variant='filled' fullWidth />
                </Grid>
                <Grid item xs={12}>
                    <TextField label='Contraseña' type='password' variant='filled' fullWidth />
                </Grid>
                <Grid item xs={12} >
                    <NextLink href='/auth/register' passHref>
                        <Link underline='hover' color='secondary' sx={{fontSize: "0.9rem"}}>
                            ¿No tienes una cuenta?
                        </Link>
                    </NextLink>
                </Grid>
                <Grid item xs={12}>
                    <Button color='secondary' className='circular-btn' size='large' fullWidth>
                        Ingresar
                    </Button>
                </Grid>
            </Grid>
        </Box>
    </AuthLayout>
  )
}

export default LoginPage