import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '../../../utils';

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
        case 'POST':
            return registerUser(req, res)
    
        default:
            return res.status(400).json({message: `Bad request, method ${req.method} does not exist`  });
    }
}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '', name = '', lastname = '' } = req.body as { email: string, password: string, name: string, lastname: string };

    if (password.length < 6) {
        return res.status(400).json({message: 'La contraseña debe de ser de al menos 6 caracteres'})
    }

    if (name.length < 3 || lastname.length < 3) {
        return res.status(400).json({message: 'El nombre o apellido deben de ser de al menos 2 caracteres'})
    }

    if (!validations.isValidEmail(email)) {
        return res.status(400).json({message: 'El correo ingresado no es válido'})
    }

    await db.connect()
    const user = await User.findOne({email})

    if (user) {
        await db.disconnect()
        return res.status(400).json({message: 'Ese correo ya está registrado'})
    }
    
    const newUser = new User({
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name,
        lastname
    })

    try {
        await newUser.save({validateBeforeSave: true})
        await db.disconnect()
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: 'Revisar logs del servidor'})
    }

        
    const { _id, role } = newUser

    const token = jwt.generateToken(_id, email)

    return res.status(200).json({
        token,
        user: {
            role,
            name,
            lastname,
            email
        }
    })
}
