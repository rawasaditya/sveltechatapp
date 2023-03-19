import { db } from "../database/db";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import io from 'socket.io-client';
const socket = io('http://localhost:3000');

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
            token: "",

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

const searchAllUsers = async (searchString, locals) => {
    const user = locals.user.id
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
            }
        })
        users = users.map(i => {
            const details = {
                id: i.id,
                firstName: i.firstName,
                lastName: i.lastName,
                picture: i.picture,
                requestSentTo: i?.requestReceived?.includes(user),
                friends: i?.friends?.includes(user),
                requestReceived: locals?.user?.requestReceived?.includes(i?.id) || false
            }
            return details
        })
        return users;

    } catch (err) {
        console.log(err)
    }
}

const sendRequest = async (send, locals) => {
    const id = locals.user.id

    await db.user.update({
        where: { id: send },
        data: {
            requestReceived: {
                push: id
            }
        }
    })
    await db.notification.create({
        data: {
            message: `Request Received ${locals.user.firstName || ""} ${locals.user.lastName || ""}`,
            from: id,
            fromFirstName: locals.user.firstName || "",
            fromLastName: locals.user.lastName || "",
            notifyTo: {
                connect: {
                    id: send
                }
            }
        }
    })
    socket.emit("notification", {
        to: send,
        notificationId: "requestSent",
    });

    return { "success": "success" }
}

const acceptRequest = async (id, locals, accept) => {
    const idx = locals.user.requestReceived.indexOf(id)
    const newArr = locals.user.requestReceived.splice(idx, 1)
    let user = {};
    if (accept) {
        await db.user.update({
            where: {
                id: id
            },
            data: {
                friends: {
                    push: locals.user.id
                }
            }
        })

        user = await db.user.updateMany({
            where: {
                id: locals.user.id
            },
            data: {
                requestReceived: locals.user.requestReceived,
                friends: {
                    push: id
                }
            }
        })

        await db.chatRoom.create({
            data: {
                people: [id, locals.user.id]
            }
        })


    } else {
        user = await db.user.updateMany({
            where: {
                id: locals.user.id
            },
            data: {
                requestReceived: locals.user.requestReceived
            }
        })
    }

    return accept;
}

const getNotifications = async (id) => {
    const notifications = await db.notification.findMany({
        where: {
            notifyToId: id
        }
    })
    return notifications
}

const generateNotification = async (id, locals) => {
    await db.notification.create({
        data: {
            message: `Request accepted ${locals.user.firstName || ""} ${locals.user.lastName || ""}`,
            from: locals.user.id,
            fromFirstName: locals.user.firstName || "",
            fromLastName: locals.user.lastName || "",
            notifyTo: {
                connect: {
                    id: id
                }
            }
        }
    })

    await socket.emit("notification", {
        to: id,
        notificationId: "requestSent",
    });
    await socket.emit("notification", {
        to: locals.user.id,
        notificationId: "requestSent",
    });

}

const deleteNotification = async (id) => {
    return await db.notification.deleteMany({
        where: {
            id
        }
    })
}


const searchAllFriends = async (locals) => {
    const user = locals.user.id
    try {
        let currentUser = await db.user.findUnique({
            where: {
                id: user
            }
        })

        let friends = await db.user.findMany({
            where: {
                id: {
                    in: currentUser.friends
                }
            }
        })
        let users = friends.map(i => {
            const details = {
                id: i.id,
                firstName: i.firstName,
                lastName: i.lastName,
                picture: i.picture,
                requestSentTo: i?.requestReceived?.includes(user),
                friends: i?.friends?.includes(user),
                requestReceived: locals?.user?.requestReceived?.includes(i?.id) || false
            }
            return details
        })
        return users;

    } catch (err) {
        console.log(err)
    }
}

const saveMessage = async (body) => {
    const {
        to,
        from,
        message,
        chatId
    } = body;
    const chat = await db.messagesModel.create({
        data: {
            ChatRoom: {
                connect: {
                    id: chatId
                }
            },
            to,
            from,
            message
        }
    })
    return chat
}

const getChatRoomReady = async (id, from) => {
    const chatDetails = await db.chatRoom.findMany({
        where: {
            AND: [
                {
                    people: {
                        hasEvery: [id, from]
                    }
                },
                {
                    isPrivate: true
                }
            ]

        }
    })
    return chatDetails
}



export {
    registerUser,
    getUserFromEmail,
    validateUser,
    generateSignToken,
    getUserFromToken,
    searchAllUsers,
    sendRequest,
    acceptRequest,
    getNotifications,
    generateNotification,
    deleteNotification,
    searchAllFriends,
    saveMessage,
    getChatRoomReady
}