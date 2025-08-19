const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(__dirname));
app.use(express.json());

// Session settings
app.use(session({
  secret: 'I6UYvO_:5%y>jUDN',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true only in HTTPS
}));

const tweetsFile = path.join(__dirname, 'twitter', 'tweets.json');

// Admin login
app.post('/login', (req, res) => {
  const { password } = req.body;
  console.log('Password received:', password);
  if (password === 'dm0niixdominomin') {
    req.session.isAdmin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// GET tweets (public)
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

// POST tweets (admin only)
app.post('/tweets', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  try {
    const { user, message, date } = req.body;
    if (!user || !message) {
      return res.status(400).json({ error: 'Missing user or message' });
    }

    let tweets = [];
    if (fs.existsSync(tweetsFile)) {
      const data = fs.readFileSync(tweetsFile, 'utf-8');
      tweets = JSON.parse(data);
    }

    const newTweet = {
      id: tweets.length ? tweets[tweets.length - 1].id + 1 : 1,
      user,
      message,
      date: date || new Date().toISOString()
    };

    tweets.push(newTweet);
    fs.writeFileSync(tweetsFile, JSON.stringify(tweets, null, 2));

    res.status(201).json(newTweet);
  } catch (err) {
    console.error('Error saving tweet:', err);
    res.status(500).json({ error: 'Could not save tweet' });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
