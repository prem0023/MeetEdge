// initiaize express
const express = require('express');
const app = express();
//create server
const server = require('http').Server(app);

app.set('view engine', 'ejs');
// v4 is version and uuid4 is variable name can be different
const { v4: uuidV4 } = require('uuid')

const {ExpressPeerServer} = require( 'peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.use('/peerjs', peerServer);
// it will make the public folder available
app.use(express.static('public'));
const io = require('socket.io')(server)

// install ejs -  its is for integrationg js from backend(be) to frontend(fe)
// uuid - it will generate unique id for room it is not room id

app.use('/peerjs', peerServer);

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId);
    // messages
    socket.on('message', message => {
      //send message to the same room
      io.to(roomId).emit('createMessage', message)
  }); 

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(process.env.PORT||3030)