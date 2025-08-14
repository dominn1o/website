function buttonPress() {
    const button = document.getElementById('button1');
    const background = document.getElementById('bg');
    button.addEventListener('click', () => {
        background.style.backgroundColor = 
            background.style.backgroundColor === 'purple' ? 'pink' : 'purple';
    });
}