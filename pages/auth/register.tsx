import React, { useContext, useState } from 'react'
import { GetServerSideProps } from 'next'
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { AuthLayout } from '../../components/layouts'
import { Box, Grid, Typography, TextField, Button, Link, Chip } from '@mui/material';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';
import { AuthContext } from '../../context';

type FormData = {
    name: string,
    lastname: string,
    email: string,
    password: string,
};

const RegisterPage = () => {
    const router = useRouter()
    const { registerUser } = useContext(AuthContext)
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const destinationAuth = router.query.p ? `/auth/login?p=${router.query.p}`  : '/auth/login'
    
    const onRegisterForm = async({name, lastname, email, password}: FormData) => {
        setShowError(false)
        setErrorMessage('')
        const { hasError, message } = await registerUser(name, lastname, email, password)
        if (hasError) {
            setShowError(true)
            setErrorMessage(message!)
            setTimeout(() => setShowError(false), 3000)
            return
        }

        //* Redirigir a la pantalla que el usuario estaba antes
        // const destination = router.query.p?.toString() || '/'
        // router.replace(destination)
        await signIn('credentials', { email, password })
    }

    return (
        <AuthLayout title='Registro'>
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>
                <Box sx={{width: 350, paading: '10px 20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1' textAlign='center'>Crear cuenta</Typography>
                            <Chip 
                                label='Correo o contraseña no validos'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label='Nombre' 
                                variant='filled' 
                                fullWidth 
                                { ...register('name', {
                                    required: 'El nombre es requerido',
                                    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                                }) }
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label='Apellido' 
                                variant='filled' 
                                fullWidth 
                                { ...register('lastname', {
                                    required: 'El nombre es requerido',
                                    minLength: { value: 2, message: 'El apellido debe tener al menos 2 caracteres' }
                                }) }
                                error={!!errors.lastname}
                                helperText={errors.lastname?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                type='email'
                                label='Correo' 
                                variant='filled' 
                                fullWidth 
                                { ...register('email', {
                                    required: 'El email es requerido',
                                    validate: validations.isEmail
                                }) }
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label='Contraseña' 
                                type='password' 
                                variant='filled' 
                                fullWidth 
                                { ...register('password', {
                                    required: 'El password es requerido',
                                    minLength: { value: 6, message: 'El password debe tener al menos 6 caracteres' }
                                }) }
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12} >
                            <NextLink href={destinationAuth} passHref>
                                <Link underline='hover' color='secondary' sx={{fontSize: "0.9rem"}}>
                                    ¿Ya tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth
                                type='submit'
                            >
                                Registrarse
                            </Button>
                        </Grid>
                        
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
    const session = await getSession({req})
    
    const { p = '/'} = query

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}

export default RegisterPage