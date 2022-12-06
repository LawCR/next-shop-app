import jwt from 'jsonwebtoken'


export const generateToken = ( _id: string, email: string ) => {
    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('No  hay semilla de JWT - Revisar archivo .env')
    }
        
    return jwt.sign(
        { _id, email }, 
        process.env.JWT_SECRET_SEED, 
        { expiresIn: '30d' }
    )
}

// Devuelve el id del usuario si el token es válido
export const isValidToken = ( token: string ): Promise<string> => {
    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('No  hay semilla de JWT - Revisar archivo .env')
    }

    if ( token.length <= 10 ) {
        return Promise.reject('Token inválido')
    }

    return new Promise( (resolve, reject) => {
        try {
            jwt.verify(token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if (err) return reject('JWT no es válido')
                
                const { _id } = payload as { _id: string }
                resolve(_id)
            })
        } catch (error) {
            reject('JWT no es válido')
        }
    })
}