const express = require('express');
const socketIo = require('socket.io');
const http = require('http');
const {
    json
} = require('express');

const users = {}
const port = process.env.PORT || 3001;
const app = express();
app.use(express.static('public'))

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*"
    }
});

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('home')
})

io.on('connection', (socket) => {
    socket.emit('getid', socket.id)

    socket.on('active', (user) => {
        users[socket.id] = user;
        const newUser = {};
        newUser[socket.id] = user;
        socket.broadcast.emit('active', JSON.stringify(newUser));
        console.log(users)
    });

    socket.on('send', (data) => {
        data = JSON.parse(data);
        io.to(data.id).emit('receive', JSON.stringify({
            id: socket.id,
            msg: data.msg
        }));
    });


    socket.on('disconnect', reason => {
        if (reason === "io server disconnect") {
            // the disconnection was initiated by the server, you need to reconnect manually
            socket.connect();
        } else {
            delete users[socket.id]
            socket.broadcast.emit('disconnected', socket.id)
        }
    })

});

function makeArr() {
    const userArr = [];
    for (const names in users) {
        userArr.push(users[names]);
    }
    return userArr;
}


app.get('/users', (req, res) => {
    res.send(JSON.stringify(users))
})

server.listen(port, () => {
    console.log('listening to ' + port)
})