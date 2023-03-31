const http = require('http');
const server = http.createServer();
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', async (socket) => {
  console.log('Connection established!');

  socket.on('chat', (message) => {
    io.emit('chat', message)
  });
});

server.listen(3000, () => {
  console.log('Listening on *:3000');
});