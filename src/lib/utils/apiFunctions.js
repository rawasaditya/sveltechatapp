import { db } from "../database/db";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'

// Exclude keys from user
function exclude(object, keys) {
    for (let key of keys) {
        delete object[key]
    }
    return object
}

const registerUser = async (email, password, firstName, lastName) => {
    const user = await db.user.findUnique({
        where: {
            email: email
        }
    })
    if (user) {
        throw "User Already exists";
    }
    const hash = bcrypt.hashSync(password, 10);
    const newUser = await db.user.create({
        data: {
            email,
            password: hash,
            firstName,
            lastName,
            token: ""
        }
    })

    return newUser

}


const getUserFromEmail = async (email) => {
    const user = await db.user.findUnique({ where: { email }, })
    if (user) {
        return exclude(user, ['token'])
    } else {
        throw "User Does not exist"
    }
}


const getUserFromToken = async (token) => {
    const user = await db.user.findMany({ where: { token }, })
    if (user && user.length) {
        return exclude(user[0], ['password'])
    } else {
        throw "User Does not exist"
    }
}

const validateUser = async (email, password) => {
    const user = await getUserFromEmail(email)
    return await bcrypt.compare(password, user.password)
}


const generateSignToken = async (email) => {
    const user = await getUserFromEmail(email);
    const token = jwt.sign({
        data: exclude(user, ['token'])
    }, 'secret', { expiresIn: '1h' })
    await db.user.update({
        where: { email },
        data: { token }
    })
    return token
}



export {
    registerUser,
    getUserFromEmail,
    validateUser,
    generateSignToken,
    getUserFromToken
}