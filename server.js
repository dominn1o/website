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
const messagesFile = path.join(__dirname, 'chat', 'messages.json');


//TWITTER

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

// ---- DELETE Tweet by ID ----
app.delete('/tweets/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

    // Load tweets safely
    let tweets = [];
    if (fs.existsSync(tweetsFile)) {
      const raw = fs.readFileSync(tweetsFile, 'utf8') || '[]';
      try {
        tweets = JSON.parse(raw);
        if (!Array.isArray(tweets)) tweets = [];
      } catch {
        tweets = [];
      }
    }

    // Find the tweet to delete
    const idx = tweets.findIndex(t => t.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Tweet not found' });
    }

    // Remove and save
    tweets.splice(idx, 1);
    fs.writeFileSync(tweetsFile, JSON.stringify(tweets, null, 2));

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting tweet:', err);
    res.status(500).json({ error: 'Could not delete tweet' });
  }
});




//CHAT


// GET all messages
app.get('/chat/messages', (req, res) => {
    try {
      const data = fs.readFileSync(messagesFile, 'utf8');
      const messages = JSON.parse(data);
      res.json(messages);
    } catch (err) {
      console.error('Error reading messages:', err);
      res.status(500).json({ error: 'Could not load messages' });
    }
});

// POST new message
app.post('/chat/messages', (req, res) => {

  try {
      const { user, text, message, date } = req.body;
      const content = text || message;
      if (!user || !content) {
        return res.status(400).json({ error: 'Missing user or message' });
      }

      let messages = [];
      if (fs.existsSync(messagesFile)) {
        const data = fs.readFileSync(messagesFile, 'utf-8');
        messages = JSON.parse(data);
      }

      const newMessage = {
        id: messages.length ? messages[messages.length - 1].id + 1 : 1,
        user,
        message: content,   // always save as "message"
        date: date || new Date().toISOString()
      };

      messages.push(newMessage);
      fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));

      res.status(201).json(newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
      res.status(500).json({ error: 'Could not save message' });
    }  
    
});

// DELETE a message by ID
app.delete('/chat/messages/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

    let messages = [];
    if (fs.existsSync(messagesFile)) {
      messages = JSON.parse(fs.readFileSync(messagesFile, 'utf8'));
    }

    const newMessages = messages.filter(m => m.id !== id);

    fs.writeFileSync(messagesFile, JSON.stringify(newMessages, null, 2));

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete message' });
  }
});



app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
