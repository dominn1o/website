document.addEventListener('DOMContentLoaded', () => {
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
    small.textContent = isNaN(dt) ? tweet.date : dt.toLocaleString();

    div.appendChild(strong);
    div.appendChild(text);
    div.appendChild(br);
    div.appendChild(small);
    return div;
    }

    async function loadTweets() {
    try {
        const res = await fetch('/tweets');
        if (!res.ok) throw new Error(`GET /tweets failed: ${res.status}`);
        const tweets = await res.json();
        tweetsSection.innerHTML = '';
        const frag = document.createDocumentFragment();
        for (const t of tweets) frag.appendChild(renderTweetSafe(t));
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

    form.addEventListener('submit', async (e) => {
    e.preventDefault();                   // stop page reload
    const user = usernameInput.value.trim();
    const message = messageInput.value.trim();
    if (!user || !message) return;

    // disable submit during request
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
        messageInput.focus();   // nice UX
    }
    });

    loadTweets();

});