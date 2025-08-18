const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));

// Parse JSON bodies
app.use(express.json());

const tweetsFile = path.join(__dirname, 'twitter', 'tweets.json');

// GET tweets
app.get('/tweets', (req, res) => {
  try {
    const data = fs.readFileSync(tweetsFile, 'utf-8');
    const tweets = JSON.parse(data);
    res.json(tweets);
  } catch (err) {
    console.error('Error reading tweets:', err);
    res.status(500).json({ error: 'Could not load tweets' });
  }
});

// POST new tweet
app.post('/tweets', (req, res) => {
  try {
    const { user, message, date } = req.body;

    if (!user || !message) {
      return res.status(400).json({ error: 'Missing user or message' });
    }

    // Read current tweets
    let tweets = [];
    if (fs.existsSync(tweetsFile)) {
      const data = fs.readFileSync(tweetsFile, 'utf-8');
      tweets = JSON.parse(data);
    }

    // Create new tweet
    const newTweet = {
      id: tweets.length ? tweets[tweets.length - 1].id + 1 : 1,
      user,
      message,
      date: date || new Date().toISOString()
    };

    // Add to list
    tweets.push(newTweet);

    // Save back to file
    fs.writeFileSync(tweetsFile, JSON.stringify(tweets, null, 2));

    res.status(201).json(newTweet);
  } catch (err) {
    console.error('Error saving tweet:', err);
    res.status(500).json({ error: 'Could not save tweet' });
  }
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));