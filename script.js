//Button press
function buttonPress() {
    const button = document.getElementById('button1');
    const background = document.getElementById('bg');
    button.addEventListener('click', () => {
        background.style.backgroundColor = 
            background.style.backgroundColor === 'purple' ? 'pink' : 'purple';
    });
}

//Studs Banner Movement
document.addEventListener('DOMContentLoaded', () => {
    const studs = document.querySelector('.studs');
    let offset = 0;
    const speed = -0.6; // pixels per frame

    function animateStuds() {
        offset -= speed;
        studs.style.backgroundPosition = `${offset}px 0`;
        requestAnimationFrame(animateStuds);
    }

    animateStuds();
});
