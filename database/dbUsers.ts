import { db } from "."
import { User } from "../models"
import bcrypt from 'bcryptjs';

//* Verifica el usuario por custom Login (personalizado)
export const checkUserEmailPassword = async(email: string, password: string) => {
    await db.connect()

    const user = await User.findOne({email})
    await db.disconnect()

    if(!user) return null
    if (!bcrypt.compareSync(password, user.password!)) return null

    const { role, name, lastname, _id,  } = user

    return {
        _id,
        email: email.toLowerCase(),
        role,
        name,
        lastname
    }
}

//* Crea o verifica el usuario por OAUTH (email, name, image)
export const oAuthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
    const nameSplit = oAuthName.split(' ')
    let _firstname 
    let _lastname
    switch (nameSplit.length) {
        case 1:
            _firstname = nameSplit[0]
            _lastname = ''
            break;
        case 2:
            _firstname = nameSplit[0]
            _lastname = nameSplit[1]
            break;
        case 3:
            _firstname = nameSplit[0]
            _lastname = nameSplit[1] + ' ' + nameSplit[2]
            break;
        case 4:
            _firstname = nameSplit[0] + ' ' + nameSplit[1]
            _lastname = nameSplit[2] + ' ' + nameSplit[3]
            break;
        case 5:
            _firstname = nameSplit[0] + ' ' + nameSplit[1]
            _lastname = nameSplit[2] + ' ' + nameSplit[3] + ' ' + nameSplit[4]
            break;
    
        default:
            break;
    }

    await db.connect()
    const user = await User.findOne({email: oAuthEmail})
    if (user) {
        await db.disconnect()
        const { _id, name, lastname, email, role } = user
        return { _id, name, lastname, email, role  }
    }

    const newUser = new User({email: oAuthEmail, name: _firstname, lastname: _lastname, password: '@', role: 'client'})
    await newUser.save()
    await db.disconnect()

    const { _id, name, lastname, email, role  } = newUser
    return { _id, name, lastname, email, role  }
}