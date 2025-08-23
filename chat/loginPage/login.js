document.addEventListener('DOMContentLoaded', () => {

    // Go back button
    document.getElementById('Back').addEventListener('click', () => {
        window.location.href = '../../index.html';
    });

    //Login
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;

        const res = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({ password })

        });

        if (res.ok) {
            alert('Logged in successfully');
            window.location.href = '../adminChat/admin.html';
        } else {
            alert('Wrong password');
        }
    })
});