const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const mainBtn = document.getElementById('mainBtn');
const resetBtn = document.getElementById('resetBtn');

let totalSeconds = 0;
let intervalId = null;

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

mainBtn.addEventListener('click', () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    showStart();
  } else {
    intervalId = setInterval(tick, 1000);
    showPause();
  }
});

resetBtn.addEventListener('click', () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  totalSeconds = 0;
  render();
  resetBtn.disabled = true;
  showStart();
});

render();
