const startBtn = document.getElementById('start-timer');
const breakBtn = document.getElementById('break-timer');
const stopBtn = document.getElementById('stop-timer');
const timeInput = document.getElementById('work-minutes');
const display = document.getElementById('timer-display');
const progressBar = document.getElementById('progress-bar');

let interval = null;
let seconds = 0;
let totalSeconds = 0;
let isPaused = false;

function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function updateDisplay() {
    display.textContent = formatTime(seconds);
}

function updateProgressBar(percent) {
    progressBar.style.width = `${percent}%`;
}

function startTimer(duration, notifyLabel = '完了') {
    if (interval) clearInterval(interval);

    seconds = duration;
    totalSeconds = duration;
    isPaused = false;
    updateDisplay();
    updateProgressBar(0);
    stopBtn.textContent = '⏸ 一時停止';

    interval = setInterval(() => {
        if (!isPaused) {
            seconds--;
            updateDisplay();
            updateProgressBar((totalSeconds - seconds) / totalSeconds * 100);

            if (seconds <= 0) {
                clearInterval(interval);
                interval = null;
                updateProgressBar(100);
                new Audio('alarm.wav').play();
                if (window.safeAPI) {
                    window.safeAPI.notify(`${notifyLabel}`, '時間になりました！');
                }
            }
        }
    }, 1000);
}

// 作業タイマー（25分など）
startBtn.addEventListener('click', () => {
    const duration = parseInt(timeInput.value, 10) * 60;
    startTimer(duration, 'Pomodoro 完了');
});

// 休憩タイマー（固定5分）
breakBtn.addEventListener('click', () => {
    startTimer(5 * 60, '休憩終了');
});

// 一時停止／再開
stopBtn.addEventListener('click', () => {
    if (interval) {
        isPaused = !isPaused;
        stopBtn.textContent = isPaused ? '▶ 再開' : '⏸ 一時停止';
    }
});
