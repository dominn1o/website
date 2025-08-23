document.addEventListener('DOMContentLoaded', () => {

    //Go back
    document.getElementById('Back').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    
    const messagesSection = document.getElementById('messagesSection');

    // Render a single message
    function renderMessage(msg) {
        const div = document.createElement('div');
        div.className = 'message';
        div.innerHTML = `
            <strong>${msg.user}</strong>: ${msg.message}
            <br><small>${new Date(msg.date).toLocaleDateString()}</small>
            <button class="delete-btn" data-id="${msg.id}">Delete</button>
        `;
        return div;
    }

    // Load messages from server
    async function loadMessages() {
        try {
            const res = await fetch('/chat/messages');
            if (!res.ok) throw new Error(`GET /messages failed: ${res.status}`);

            const messages = await res.json();

            // Sort newest first
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

        // Attach delete listeners
        messagesSection.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                if (!id) return;

                try {
                    const res = await fetch(`/chat/messages/${id}`, {
                        method: 'DELETE'
                    });
                    if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
                    
                    loadMessages(); // Reload messages after deletion
                } catch (err) {
                    console.error(err);
                    alert('Failed to delete message.');
                }
            });
        });
    }

    // Initial load
    loadMessages();
});
