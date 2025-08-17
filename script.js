document.addEventListener('DOMContentLoaded', () => {
    // Button press
    document.getElementById('button1').addEventListener('click', () => {
        window.location.href = 'portfolio/portfolio.html';
    });

    // Open minesweeper
    document.getElementById('minesweeperButton').addEventListener('click', () => {
        window.location.href = 'minesweeper/minesweeper.html';
    });

    //open music
    document.getElementById('musicPortfolio').addEventListener('click', () => {
        window.location.href = 'musicPortfolio/music.html';
    });

// Studs Banner Movement
    const studs = document.querySelector('.studs');
    let offset = 0;
    const speed = 0.6; // positive = move left, negative = move right

    function animateStuds() {
    offset += speed;
    // use modulo to prevent offset from growing infinitely
    studs.style.backgroundPosition = `${offset % window.innerWidth}px 0`;
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

    //Change the phone image on click
    const phone = document.querySelector('.phone-split');    // # for id
    const phoneInv = document.querySelector('.phone-splitInv');
    phone.style.opacity = '1'

    phone.addEventListener('click', () => {
        if (phone.style.opacity == '1') { 
        phone.style.opacity = '0';
        } else {
            phone.style.opacity = '1';
        }
    });

    function openExternal(url) {
    window.open(url, "_blank", "noopener");
    }

    document.querySelector(".Instagram")
    .addEventListener("click", () => openExternal("https://www.instagram.com/dominn1o/"));
    document.querySelector(".Tiktok")
    .addEventListener("click", () => openExternal("https://www.tiktok.com/@dominn1o"));
    document.querySelector(".Facebook")
    .addEventListener("click", () => openExternal("https://www.facebook.com/Dominik.Madyavanhu"));



    animateStuds();
});
