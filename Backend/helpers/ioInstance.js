// ioInstance.js
const socketIo = require('socket.io');

let io;

const init = (httpServer) => {
    io = socketIo(httpServer, {
        cors: {
            origin: "*", // Ajusta según tus necesidades
            methods: ["GET", "POST"]
        }
    });
    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

module.exports = { init, getIo };

