document.addEventListener('DOMContentLoaded', () => {
    // Go back button
    const backBtn = document.getElementById('Back');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.href = '../../index.html';
        });
    }

    const form = document.getElementById('message-form');
    const userInput = document.getElementById('user');
    const messageInput = document.getElementById('message');
    const messagesSection = document.getElementById('messagesSection');

    // render a single message safely
    function renderMessage(msg) {
        const div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = `
            <strong>${msg.user}</strong>: ${msg.message}
            <br><small>${new Date(msg.date).toLocaleDateString()}</small>
        `;
        return div;
    }

    // load messages from server
    async function loadMessages() {
        try {
            const res = await fetch('/chat/messages');
            if (!res.ok) throw new Error(`GET /messages failed: ${res.status}`);

            const messages = await res.json();

            // newest first
            messages.sort((a, b) => new Date(b.date) - new Date(a.date));

            messagesSection.innerHTML = '';

            const frag = document.createDocumentFragment();
            for (const m of messages) {
                frag.appendChild(renderMessage(m));
            }
            messagesSection.appendChild(frag);
        } catch (err) {
            console.error(err);
            messagesSection.textContent = 'Could not load posts.';
        }
    }

    async function postMessage(user, message) {
        const res = await fetch('/chat/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, message, date: new Date().toISOString() })
        });
        if (!res.ok) {
            const msg = await res.text().catch(() => '');
            throw new Error(`POST /messages failed: ${res.status} ${msg}`);
        }
    }

    // form submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();                   // stop page reload
        const user = userInput.value.trim();
        const message = messageInput.value.trim();
        if (!user || !message) return;

        // disable submit during request
        const submitBtn = form.querySelector('button[type="submit"], #post-btn');
        if (submitBtn) submitBtn.disabled = true;

        try {
            await postMessage(user, message);
            form.reset();
            await loadMessages();
        } catch (err) {
            console.error(err);
            alert('Failed to post. Please try again.');
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            messageInput.focus();   // nice UX
        }
    });

    loadMessages();
});
