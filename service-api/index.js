const express = require('express');
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3000;

const client = new MongoClient(`mongodb://localhost:27017`);
const messages_collection = client.db('chat').collection('messages')

app.use(express.json());

app.post('/messages', async (req, res) => {
  try {
    const message = req.body.text;
    const obj = {type: message.type, text: message.content, timestamp: new Date()}
    messages_collection.insertOne(obj);
    res.status(201).send(obj);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.get('/messages', async (req, res) => {
  try {
    const chat = await messages_collection.find().toArray()
    res.status(200).send(chat);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
