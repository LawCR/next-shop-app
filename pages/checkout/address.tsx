import { ShopLayout } from '../../components/layouts/ShopLayout';
import { Typography, Grid, TextField, FormControl, Input, InputLabel, Select, MenuItem, Box, Button } from '@mui/material';
import { countries } from '../../utils';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { CartContext } from '../../context';

type FormData = {
    firstName: string;
    lastName: string,
    address: string,
    address2: string,
    zip: string,
    city: string,
    country: string,
    phone: string,
}

const getAddressFromCookies = ():FormData => {
    return {
        firstName : Cookies.get('firstName') || '',
        lastName : Cookies.get('lastName') || '',
        address : Cookies.get('address') || '',
        address2 : Cookies.get('address2') || '',
        zip : Cookies.get('zip') || '',
        city : Cookies.get('city') || '',
        country : Cookies.get('country') || countries[0].code,
        phone : Cookies.get('phone') || '',
    }
}

// Hacer una direccion permanente para el usuario
const AddressPage = () => {

    const { updateAddress } = useContext(CartContext)
    const router = useRouter()

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        defaultValues: getAddressFromCookies()
    });

    useEffect(() => {
        reset(getAddressFromCookies())
    }, [reset])

    const onSubmit = (data: FormData) => {
        // console.log(data)
        updateAddress(data)
        router.push('/checkout/summary')
    }

    return (
        <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Typography variant='h1' component='h1' sx={{textAlign: 'center'}}>Dirección</Typography>
                <Grid container spacing={2} sx={{mt: 2}} >
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Nombre' 
                            variant='filled' 
                            fullWidth 
                            { ...register('firstName', {
                                required: 'El nombre es requerido'
                            }) }
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Apellido' 
                            variant='filled' 
                            fullWidth 
                            { ...register('lastName', {
                                required: 'El apellido es requerido'
                            }) }
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Dirección' 
                            variant='filled' 
                            fullWidth 
                            { ...register('address', {
                                required: 'La dirección es requerida'
                            }) }
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Dirección 2 (opcional)' 
                            variant='filled' 
                            fullWidth 
                            { ...register('address2')}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Código Postal' 
                            variant='filled' 
                            fullWidth 
                            { ...register('zip', {
                                required: 'El código postal es requerido'
                            }) }
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Ciudad' 
                            variant='filled' 
                            fullWidth 
                            { ...register('city', {
                                required: 'La ciudad es requerida'
                            }) }
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth> 
                            <TextField 
                                key={Cookies.get('country') || countries[0].code}
                                select
                                variant='filled'
                                label='País'
                                defaultValue={Cookies.get('country') || countries[0].code}
                                { ...register('country', {
                                    required: 'El país es requerido'
                                }) }
                                error={!!errors.country}
                                helperText={errors.country?.message}
                            >
                                {
                                    countries.map(country => (
                                        <MenuItem 
                                            key={country.code}
                                            value={country.code}
                                        >
                                            {country.name}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            label='Teléfono' 
                            variant='filled' 
                            fullWidth 
                            { ...register('phone', {
                                required: 'El teléfono es requerido'
                            }) }
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{mt: 5}} display='flex' justifyContent='center'>
                    <Button 
                        type='submit'
                        color='secondary' 
                        className='circular-btn' 
                        size='large'
                    >
                        Revisar pedido
                    </Button>
                </Box>
            </form>                    
        </ShopLayout>
    )
}

export default AddressPage

//* Para este caso se puede reemplazar getServerSideProps por los mmidlewares para validar que este autenticado
// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//     const { token = '' } = req.cookies
//     let isValidToken = false
//     try {
//         await jwt.isValidToken(token)
//         isValidToken = true
//     } catch (error) {
//         isValidToken = false
//     }
//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }
//     return {
//         props: {
//         }
//     }
// }
