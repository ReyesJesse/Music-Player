// === Element References ===
const albumArt = document.querySelector('.album-art');
const audio = document.getElementById('audio-player');
const playBtn = document.getElementById('play');
const backBtn = document.getElementById('back');
const forwardBtn = document.getElementById('forward');
const progressContainer = document.getElementById('progress-container');
const progress = document.getElementById('progress');
const thumb = document.getElementById('thumb');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// === Vinyl Spin Animation ===
let rotation = 0;
let speed = 0;
let targetSpeed = 0;
const maxSpeed = 2;
const acceleration = 0.03;
let animationFrameId;

function spin() {
  speed += Math.sign(targetSpeed - speed) * Math.min(acceleration, Math.abs(targetSpeed - speed));
  rotation = (rotation + speed) % 360;
  albumArt.style.transform = `rotate(${rotation}deg)`;

  if (speed !== 0 || targetSpeed !== 0) {
    animationFrameId = requestAnimationFrame(spin);
  }
}

audio.addEventListener('play', () => {
  targetSpeed = maxSpeed;
  spin();
});

audio.addEventListener('pause', () => {
  targetSpeed = 0;
});

// === Controls ===
playBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    audio.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
});

backBtn.addEventListener('click', () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

forwardBtn.addEventListener('click', () => {
  audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
});

// === Progress Bar Interaction ===
progressContainer.addEventListener('click', (e) => {
  const width = progressContainer.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
});

// === Time Display ===
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${percent}%`;
  thumb.style.left = `${percent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});
