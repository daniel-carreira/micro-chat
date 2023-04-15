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
const isComplete = process.env.DATABASE_CONN.startsWith('mongodb')
const completeConnStr = isComplete ? `${process.env.DATABASE_CONN}` : `mongodb://${process.env.DATABASE_CONN}:27017`
console.log(completeConnStr)
const client = new MongoClient(completeConnStr);
const messages_collection = client.db('micro-chat').collection('messages');

// Google Cloud Storage
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: `${process.env.PROJECT}`,
  keyFilename: `${process.env.CREDENTIALS}`
});
const bucketName = `${process.env.BUCKET_NAME}`;
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

let port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Listening on *:${port}`);
});