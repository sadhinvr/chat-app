const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const app = express();

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*"
    }
});

app.set('view engine', 'ejs')

app.get('/home', (req, res) => {
    res.render('home')
})

server.listen(3001, () => {
    console.log('listening to 3001')
})

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg)
    });
});