
const io = require('socket.io')(8900, {
    cors: {
        origin: 'http://localhost:3000'
    }
});

let users = [];

const addUser = (userId, socketId) => {
    if (users.every((user) => user.userId !== userId)) {
        users.push({ userId, socketId })
    }
}
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (receiverId) => {
    return users.find((user) => user.userId == receiverId);
}

io.on("connection", (socket) => {
    //when connect
    console.log("a user connected.");
    socket.on("sendUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUser", users);
    })

    socket.on("sendMessages", ({ senderId, receiverId, text }) => {
        const { socketId } = getUser(receiverId)
        // console.log(socketId)
        io.to(socketId).emit("getMessages", { senderId, text })
    })

    //when disconnect
    socket.on("disconnect", () => {
        console.log("a user disconnected")
        removeUser(socket.id)
        io.emit("getUser", users);
    })
})
