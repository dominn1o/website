document.addEventListener('DOMContentLoaded', () => {
    // Go back button
    document.getElementById('Back').addEventListener('click', () => {
        window.location.href = '../index.html';
    });

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

    // Only load tweets (no form to handle here)
    loadTweets();
});
