import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import { jwt } from '../../../utils';

type Data = 
| { message: string }
| { 
    token: string, 
    user: { 
        role: string, 
        name: string, 
        lastname: string, 
        email: string 
    } 
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return revalidateJWT(req, res)
    
        default:
            return res.status(400).json({message: `Bad request, method ${req.method} does not exist`  });
    }
}

const revalidateJWT = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    // const { email = '', password = '' } = req.headers;
    const { token = '' } = req.cookies;

    let userId = '';

    try {
        userId = await jwt.isValidToken(token)
    } catch (error) {
        return res.status(401).json({
            message: 'Token no válido'
        })
    }

    await db.connect()
    const user = await User.findById(userId).lean()
    await db.disconnect()

    if (!user) {
        return res.status(400).json({message: 'El usuario no existe'})
    }

    const { _id, email, role, name, lastname } = user

    return res.status(200).json({
        token: jwt.generateToken(_id, email),
        user: {
            email,
            role,
            name,
            lastname
        }
    })
}
