const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const mainBtn = document.getElementById('mainBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapListEl = document.getElementById('lapList');
const timerView = document.getElementById('timerView');
const clockView = document.getElementById('clockView');
const timerTab = document.getElementById('timerTab');
const clockTab = document.getElementById('clockTab');
const clockHoursEl = document.getElementById('clockHours');
const clockMinutesEl = document.getElementById('clockMinutes');
const clockSecondsEl = document.getElementById('clockSeconds');

let totalSeconds = 0;
let intervalId = null;
let clockIntervalId = null;
let laps = [];

function pad(n) {
  return String(n).padStart(2, '0');
}

function render() {
  const hrs = Math.floor(totalSeconds / 3600);
  const min = Math.floor((totalSeconds % 3600) / 60);
  const sec = totalSeconds % 60;
  hoursEl.textContent = pad(hrs);
  minutesEl.textContent = pad(min);
  secondsEl.textContent = pad(sec);
}

function tick() {
  totalSeconds++;
  render();
  resetBtn.disabled = false;
  lapBtn.disabled = false;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  const sec = seconds % 60;
  return `${pad(hrs)}:${pad(min)}:${pad(sec)}`;
}

function renderLaps() {
  lapListEl.innerHTML = '';
  laps.forEach((lap, i) => {
    const li = document.createElement('li');
    li.className = 'lap-item';
    li.innerHTML = `<span class="lap-number">Lap ${lap.number}</span><span class="lap-time">${lap.timeDisplay}</span>`;
    lapListEl.appendChild(li);
  });
}

function showStart() {
  mainBtn.textContent = 'Start';
  mainBtn.classList.remove('pause');
  mainBtn.classList.add('start');
}

function showPause() {
  mainBtn.textContent = 'Pause';
  mainBtn.classList.remove('start');
  mainBtn.classList.add('pause');
}

function updateClock() {
  const now = new Date();
  clockHoursEl.textContent = pad(now.getHours());
  clockMinutesEl.textContent = pad(now.getMinutes());
  clockSecondsEl.textContent = pad(now.getSeconds());
}

function setMode(mode) {
  if (mode === 'timer') {
    timerView.classList.remove('hidden');
    clockView.classList.add('hidden');
    timerTab.classList.add('active');
    timerTab.setAttribute('aria-selected', 'true');
    clockTab.classList.remove('active');
    clockTab.setAttribute('aria-selected', 'false');
    if (clockIntervalId) {
      clearInterval(clockIntervalId);
      clockIntervalId = null;
    }
  } else {
    clockView.classList.remove('hidden');
    timerView.classList.add('hidden');
    clockTab.classList.add('active');
    clockTab.setAttribute('aria-selected', 'true');
    timerTab.classList.remove('active');
    timerTab.setAttribute('aria-selected', 'false');
    updateClock();
    if (!clockIntervalId) {
      clockIntervalId = setInterval(updateClock, 1000);
    }
  }
}

timerTab.addEventListener('click', () => setMode('timer'));
clockTab.addEventListener('click', () => setMode('clock'));

mainBtn.addEventListener('click', () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    showStart();
    lapBtn.disabled = true;
  } else {
    intervalId = setInterval(tick, 1000);
    showPause();
    resetBtn.disabled = false;
    lapBtn.disabled = false;
  }
});

resetBtn.addEventListener('click', () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  totalSeconds = 0;
  laps = [];
  render();
  renderLaps();
  resetBtn.disabled = true;
  lapBtn.disabled = true;
  showStart();
});

lapBtn.addEventListener('click', () => {
  if (!intervalId) return;
  laps.push({
    number: laps.length + 1,
    timeDisplay: formatTime(totalSeconds),
  });
  renderLaps();
});

render();

// Clock is default: start clock display
updateClock();
clockIntervalId = setInterval(updateClock, 1000);
