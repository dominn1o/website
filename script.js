document.addEventListener('DOMContentLoaded', () => {
    // Button press
    document.getElementById('button1').addEventListener('click', () => {
        window.location.href = 'portfolio/portfolio.html';
    });

    // Studs Banner Movement
    const studs = document.querySelector('.studs');
    let offset = 0;
    const speed = -0.6;

    function animateStuds() {
        offset -= speed;
        studs.style.backgroundPosition = `${offset}px 0`;
        requestAnimationFrame(animateStuds);
    }

    // Binary string
    const nums = document.querySelector('.binary');
    function randomBinaryString(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.random() > 0.5 ? '1' : '0';
        }
        return result;
    }

    setInterval(() => {
        nums.textContent = randomBinaryString(50);
    }, 80);

    animateStuds();
});
