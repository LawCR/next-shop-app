import React, { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { AuthLayout } from '../../components/layouts'
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';
import NextLink from 'next/link';
import { Box, Grid, Typography, TextField, Button, Link, Chip, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import { ErrorOutline } from '@mui/icons-material';

type FormData = {
    email: string,
    password: string,
};

const LoginPage = () => {

    const router = useRouter()
    // const { loginUser } = useContext(AuthContext)
    const [showError, setShowError] = useState(false)
    const [providers, setProviders] = useState<any>({})
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const destinationAuth = router.query.p ? `/auth/register?p=${router.query.p}`  : '/auth/register'

    useEffect(() => {
        getProviders().then(prov => {
            setProviders(prov)
        })
    }, [])


    const onLoginUser = async({email, password}: FormData) => {
        setShowError(false)
        // const isValidLogin = await loginUser(email, password)
        // if (!isValidLogin) {
        //     setShowError(true)
        //     setTimeout(() => setShowError(false), 3000)
        //     return
        // }
        // //* Redirigir a la pantalla que el usuario estaba antes
        // const destination = router.query.p?.toString() || '/'
        // router.replace(destination)

        // Sign in con NextAuth usando el email y password
        await signIn('credentials', { email, password })
    }

    return (
        <AuthLayout title='Ingresar'>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{width: 350, paading: '10px 20px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} textAlign='center'>
                            <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
                            <Chip 
                                label='Usuario o contraseña no encontrados'
                                color='error'
                                icon={<ErrorOutline />}
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
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
                                    ¿No tienes una cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={12}>
                            <Button 
                                type='submit'
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth
                            >
                                Ingresar
                            </Button>
                        </Grid>
                        <Grid item xs={12} display='flex' flexDirection='column' justifyContent='center'>
                            <Divider sx={{width: '100%', mb:2}} />
                            {
                                Object.values(providers).map((provider: any) => {
                                    if (provider.id === 'credentials') return null
                                    return (
                                        <Button 
                                            key={provider.id}
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{mb: 1}}
                                            onClick={() => signIn(provider.id)}
                                        >
                                            {provider.name}
                                        </Button>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

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

export default LoginPage