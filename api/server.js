const express = require('express');
const redis = require('redis');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const redisHost = process.env.REDIS_HOST || 'redis';
const redisClient = redis.createClient({
  url: `redis://${redisHost}:6379`
});
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

app.get('/messages', async (req, res) => {
  const messages = await redisClient.lRange('messages', 0, 49);
  res.json(messages);
});

app.post('/messages', async (req, res) => {
  const { message } = req.body;
  if (message) {
    await redisClient.lPush('messages', message);
    res.status(201).json({ success: true, message: 'Message posted' });
  } else {
    res.status(400).json({ success: false, message: 'Message cannot be empty' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});