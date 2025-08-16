document.addEventListener("DOMContentLoaded", () => {
  const audioElement = document.querySelector("audio");
  const audioCtx = new AudioContext();
  const track = audioCtx.createMediaElementSource(audioElement);

  const playButton = document.querySelector(".player-play-btn");
  const playIcon = playButton.querySelector(".player-icon-play");
  const pauseIcon = playButton.querySelector(".player-icon-pause");
  const progress = document.querySelector(".player-progress");
  const progressFilled = document.querySelector(".player-progress-filled");
  const playerCurrentTime = document.querySelector(".player-time-current");
  const playerDuration = document.querySelector(".player-time-duration");
  const volumeControl = document.querySelector(".player-volume");

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = volumeControl.value;
  track.connect(gainNode).connect(audioCtx.destination);

  const playlist = document.querySelectorAll(".playlist li");
  const songTitle = document.querySelector(".songName"); // ✅ get title element

  let currentSongIndex = 0;

  function formatTime(sec) {
    const m = Math.floor(sec / 60) || 0;
    const s = Math.floor(sec % 60) || 0;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function setTimes() {
    playerCurrentTime.textContent = formatTime(audioElement.currentTime);
    if (!isNaN(audioElement.duration)) {
      playerDuration.textContent = formatTime(audioElement.duration);
    }
  }

  function progressUpdate() {
    if (!isNaN(audioElement.duration)) {
      const percent = (audioElement.currentTime / audioElement.duration) * 100;
      progressFilled.style.flexBasis = `${percent}%`;
    }
  }

  function loadSong(index) {
    const song = playlist[index];
    if (!song) return;
    audioElement.src = song.dataset.src;
    currentSongIndex = index;

    // ✅ Update title
    songTitle.textContent = song.textContent;

    audioElement.play();
    playButton.dataset.playing = "true";
    playIcon.classList.add("hidden");
    pauseIcon.classList.remove("hidden");
  }

  // Play / Pause
  playButton.addEventListener("click", () => {
    if (audioCtx.state === "suspended") audioCtx.resume();
    if (audioElement.src === "") loadSong(currentSongIndex);

    if (playButton.dataset.playing === "false") {
      audioElement.play();
      playButton.dataset.playing = "true";
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
    } else {
      audioElement.pause();
      playButton.dataset.playing = "false";
      pauseIcon.classList.add("hidden");
      playIcon.classList.remove("hidden");
    }
  });

  // Update time & progress
  audioElement.addEventListener("timeupdate", () => {
    setTimes();
    progressUpdate();
  });

  audioElement.addEventListener("loadedmetadata", setTimes);

  audioElement.addEventListener("ended", () => {
    playButton.dataset.playing = "false";
    pauseIcon.classList.add("hidden");
    playIcon.classList.remove("hidden");
    progressFilled.style.flexBasis = "0%";
  });

  // Volume
  volumeControl.addEventListener("input", () => {
    gainNode.gain.value = volumeControl.value;
  });

  // Scrub
  let mousedown = false;
  function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * audioElement.duration;
    audioElement.currentTime = scrubTime;
  }
  progress.addEventListener("click", scrub);
  progress.addEventListener("mousemove", e => mousedown && scrub(e));
  progress.addEventListener("mousedown", () => (mousedown = true));
  progress.addEventListener("mouseup", () => (mousedown = false));

  // Playlist click
  playlist.forEach((li, index) => {
    li.addEventListener("click", () => {
      loadSong(index);
    });
  });
});
