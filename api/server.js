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
const PORT = process.env.PORT || 3000;

const REDIS_KEYS = {
  WORD_COUNT: 'word_count'
};

// Initialize Redis connection
async function initializeRedis() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
}

async function updateWordCount(word) {
  try {
    const normalizedWord = word.toLowerCase().trim();
    
    if (normalizedWord) {
      await redisClient.hIncrBy(REDIS_KEYS.WORD_COUNT, normalizedWord, 1);
    }
  } catch (error) {
    console.error('Error updating word count:', error);
  }
}

async function getWordCountDictionary() {
  try {
    const wordCounts = await redisClient.hGetAll(REDIS_KEYS.WORD_COUNT);
    
    // Convert string values to numbers
    const parsedWordCounts = Object.fromEntries(
      Object.entries(wordCounts).map(([word, count]) => [word, parseInt(count)])
    );
    
    return parsedWordCounts;
  } catch (error) {
    console.error('Error getting word count dictionary:', error);
    return {};
  }
}

// Get word count dictionary endpoint
app.get('/word-counts', async (req, res) => {
  try {
    const wordCounts = await getWordCountDictionary();
    res.json(wordCounts);
  } catch (error) {
    console.error('Error fetching word counts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching word counts' 
    });
  }
});

// Post new word endpoint
app.post('/words', async (req, res) => {
  try {
    const { word } = req.body;
    
    if (!word || !word.trim()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Word cannot be empty' 
      });
    }
    
    const trimmedWord = word.trim();
    
    await updateWordCount(trimmedWord);
    
    res.status(201).json({ 
      success: true, 
      message: 'Word added successfully',
    });
    
  } catch (error) {
    console.error('Error adding word:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding word' 
    });
  }
});

async function startServer() {
  try {
    await initializeRedis();
    
    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
      console.log(`Available endpoints:`);
      console.log(`  POST /words - Add a new word`);
      console.log(`  GET /word-counts - Get word occurrence dictionary`);
      console.log(`  GET /stats - Get comprehensive statistics`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();