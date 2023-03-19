import express from "express"
import http from "http"
import { Server } from 'socket.io'
import cors from 'cors'
const app = express();
app.use(cors({
    origin: "*"
}))
const server = http.createServer(app);

const io = new Server(server, {
    cors: "*",
});

let users = {};
let notifications = {
    "requestSent": "You have received one new request"
}


io.on('connection', (socket) => {
    socket.on("connected", function (userId) {
        users[userId.toString()] = socket.id;
    });





    socket.on('notification', (msg) => {

        if (users[msg.to]) {
            socket.to(users[msg.to]).emit("notificationReceived", notifications[msg.notificationId])
        }
    })

    socket.on('sent', msg => {
        if (users[msg.to]) {
            const data = {
                message: msg.message,
                chatId: msg.chatId
            }
            console.log(data)
            socket.to(users[msg.to]).emit("receive", data)
        }
    })





    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

app.get('/', (req, res) => {
    res.send("TEST")
})

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});