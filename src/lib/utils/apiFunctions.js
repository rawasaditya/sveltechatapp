import { db } from "../database/db";
import bcrypt from "bcryptjs";
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
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
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
    return bcrypt.compareSync(password, user.password);
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


const searchAllUsers = async (searchString, user) => {
    try {
        let users = await db.user.findMany({
            where: {
                OR: [
                    {
                        email: {
                            contains: searchString
                        }
                    },
                    {
                        firstName: {
                            contains: searchString
                        }
                    },
                    {
                        lastName: {
                            contains: searchString
                        }
                    }
                ]
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                picture: true,
                requestsReceived: {
                    select: { id: true }
                },
                requestedTo: {
                    select: { id: true }
                },
                friends: {
                    select: { id: true }
                }
            }
        })
        users = users.map(i => {
            const details = {
                id: i.id,
                firstName: i.firstName,
                picture: i.picture,
                requestsReceived: i.requestsReceived.includes(user),
                requestedTo: i.requestedTo.includes(user),
                friends: i.friends.includes(user),
            }
            return details
        })
        return users;

    } catch (err) {
        console.log(err)
    }
}


export {
    registerUser,
    getUserFromEmail,
    validateUser,
    generateSignToken,
    getUserFromToken,
    searchAllUsers
}