// Socket.IO
const http = require('http');
const server = http.createServer();
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// MongoDB
const { MongoClient } = require("mongodb");
const client = new MongoClient(`${process.env.DATABASE_URL}`);
const messages_collection = client.db('micro-chat').collection('messages');

// Google Cloud Storage
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'micro-chat-382821',
  keyFilename: './google-key.json'
});
const bucketName = 'micro-chat-bucket';
const bucket = storage.bucket(bucketName);

io.on('connection', async (socket) => {
  console.log('Connection established!');

  const chat = await messages_collection.find().toArray();
  chat.forEach((message) => {
    io.emit('chat', message.text);
  })

  socket.on('chat', (message) => {
    const obj = {text: message, timestamp: new Date()};
    messages_collection.insertOne(obj);
    io.emit('chat', message);
  });

  socket.on('image', (blobData) => {
    const blobName = Date.now().toString();
    const blob = bucket.file(blobName);
    const stream = blob.createWriteStream({
      metadata: {
        contentType: 'image/png'
      }
    });

    stream.on('error', (err) => {
      console.error(err);
    });

    stream.on('finish', () => {
      const file = bucket.file(blobName);
      file.getSignedUrl({
        action: 'read',
        expires: '03-17-2024'
      }).then(signedUrls => {
        const publicUrl = signedUrls[0];
        const obj = {text: publicUrl, timestamp: new Date()};
        messages_collection.insertOne(obj);
        io.emit('chat', publicUrl);
      }).catch(err => {
        console.error(err);
      });
    });

    stream.end(blobData);
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log('Listening on *:3000');
});