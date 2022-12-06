import { FC, useReducer, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { tesloApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
}


const Auth_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
}

export const AuthProvider: FC = ({children}) => {

    // const router = useRouter()
    const {data, status} = useSession()
    const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE)
    
    useEffect(() => {
        // console.log(data)
        if (status === 'authenticated') {
            dispatch({type: '[Auth] - Login', payload: data?.user as IUser})
        }
    }, [data, status])

    // useEffect(() => {
    //     checkToken()
    // }, [])

    const checkToken = async() => {
        if (!Cookies.get('token')) return
            
        try {
            const {data} = await tesloApi.get('/user/validate-token')
            const {token, user} = data
            Cookies.set('token', token)
            dispatch({type: '[Auth] - Login', payload: user})
        } catch (error) {
            Cookies.remove('token')
            console.log(error)
        }
    }

    const loginUser = async(email: string, password: string): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data
            Cookies.set('token', token)
            dispatch({ type: '[Auth] - Login', payload: user })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const registerUser = async(name: string, lastname: string, email: string, password: string): Promise<{hasError: boolean, message?: string}> => {
        try {
            const { data } = await tesloApi.post('/user/register', { name, lastname, email, password });
            const { token, user } = data
            Cookies.set('token', token)
            dispatch({ type: '[Auth] - Login', payload: user })
            return {
                hasError: false
            }
        } catch (error) {
           if (axios.isAxiosError(error)) {
                const { message } = error.response?.data as { message: string }
                return {
                    hasError: true,
                    message
                }
           }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario - intentelo mas tarde'
            }
        }
    }

    const logoutUser = () => {
        // Token y Carrito
        // Cookies.remove('token')
        Cookies.remove('cart')
        // Address
        Cookies.remove('firstName')
        Cookies.remove('lastName')
        Cookies.remove('address')
        Cookies.remove('address2')
        Cookies.remove('zip')
        Cookies.remove('city')
        Cookies.remove('country')
        Cookies.remove('phone')

        signOut()
        // dispatch({ type: '[Auth] - Logout' })
        // router.reload()
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            //* Methods
            loginUser,
            registerUser,
            logoutUser
        }}>
            { children }
        </AuthContext.Provider>
    )
}