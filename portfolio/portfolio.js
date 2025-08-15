document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('myAudio');
    const playBtn = document.getElementById('playBtn');
    const seekBar = document.getElementById('seekBar');
    const timeDisplay = document.getElementById('time');

    // Update seek bar max once metadata is loaded
    audio.addEventListener('loadedmetadata', () => {
        seekBar.value = 0;
        timeDisplay.textContent = formatTime(0);
    });

    // Play / Pause toggle
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playBtn.textContent = '⏸';
        } else {
            audio.pause();
            playBtn.textContent = '▶';
        }
    });

    // Update seek bar and time display while playing
    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration)) {
            seekBar.value = (audio.currentTime / audio.duration) * 100;
            timeDisplay.textContent = formatTime(audio.currentTime);
        }
    });

    // Seek to new position
    seekBar.addEventListener('input', () => {
        if (!isNaN(audio.duration)) {
            audio.currentTime = (seekBar.value / 100) * audio.duration;
        }
    });

    // Format time helper
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }
});
