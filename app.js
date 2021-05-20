const express = require('express');
const socketIo = require('socket.io');
const http = require('http');

const port = process.env.PORT || 3001;
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

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg)
    });
});

server.listen(port, () => {
    console.log('listening to ' + port)
})