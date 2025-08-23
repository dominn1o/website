document.addEventListener('DOMContentLoaded', () => {
  // Back button
  const backBtn = document.getElementById('Back');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = '../../index.html';
    });
  }

  const form = document.getElementById('tweet-form');
  const usernameInput = document.getElementById('username');
  const messageInput = document.getElementById('message');
  const tweetsSection = document.getElementById('tweets-section');

  function renderTweetSafe(tweet) {
    const div = document.createElement('div');
    div.className = 'tweet';

    const strong = document.createElement('strong');
    strong.textContent = tweet.user;

    const text = document.createElement('span');
    text.textContent = `: ${tweet.message}`;

    const br = document.createElement('br');

    const small = document.createElement('small');
    const dt = new Date(tweet.date);
    small.textContent = isNaN(dt) ? tweet.date : dt.toLocaleDateString();

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete-btn';
    delBtn.dataset.id = tweet.id;

    delBtn.addEventListener('click', async () => {
      try {
        const res = await fetch(`/tweets/${tweet.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
        await loadTweets(); // refresh list
      } catch (err) {
        console.error(err);
        alert('Failed to delete tweet.');
      }
    });

    div.appendChild(strong);
    div.appendChild(text);
    div.appendChild(br);
    div.appendChild(small);
    div.appendChild(delBtn);

    return div;
  }

  async function loadTweets() {
    try {
      const res = await fetch('/tweets');
      if (!res.ok) throw new Error(`GET /tweets failed: ${res.status}`);

      const tweets = await res.json();

      tweets.sort((a, b) => new Date(b.date) - new Date(a.date));

      tweetsSection.innerHTML = '';

      const frag = document.createDocumentFragment();
      for (const t of tweets) {
        frag.appendChild(renderTweetSafe(t));
      }
      tweetsSection.appendChild(frag);
    } catch (err) {
      console.error(err);
      tweetsSection.textContent = 'Could not load posts.';
    }
  }

  async function postTweet(user, message) {
    const res = await fetch('/tweets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, message, date: new Date().toISOString() })
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(`POST /tweets failed: ${res.status} ${msg}`);
    }
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const user = usernameInput.value.trim();
      const message = messageInput.value.trim();
      if (!user || !message) return;

      const submitBtn = form.querySelector('button[type="submit"], #post-btn');
      if (submitBtn) submitBtn.disabled = true;

      try {
        await postTweet(user, message);
        form.reset();
        await loadTweets();
      } catch (err) {
        console.error(err);
        alert('Failed to post. Please try again.');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        messageInput.focus();
      }
    });
  }

  loadTweets();
});
