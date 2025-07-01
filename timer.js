const startBtn = document.getElementById('start-timer');
const breakBtn = document.getElementById('break-timer');
const stopBtn = document.getElementById('stop-timer');
const timeInput = document.getElementById('work-minutes');
const display = document.getElementById('timer-display');
const progressBar = document.getElementById('progress-bar');
const mainButton = document.getElementById('main-timer-button');
const dropdown = document.getElementById('timer-dropdown');
const dots = document.querySelectorAll('#indicator-container .dot');

let interval = null;
let seconds = 0;
let totalSeconds = 0;
let isPaused = false;
let isRunning = false;
let completedSessions = 0;

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

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index < completedSessions);
    });
}

function notifyUser(title) {
    if (window.safeAPI) {
        window.safeAPI.notify(title, '時間になりました！');
    }

    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: '時間になりました！',
            icon: 'assets/icon.png',
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, {
                    body: '時間になりました！',
                    icon: 'assets/icon.png',
                });
            }
        });
    }

    alert('時間です！');
}

function startInterval(notifyLabel) {
    interval = setInterval(() => {
        if (!isPaused) {
            seconds--;
            updateDisplay();
            updateProgressBar((totalSeconds - seconds) / totalSeconds * 100);

            if (seconds <= 0) {
                clearInterval(interval);
                interval = null;
                isRunning = false;
                updateProgressBar(100);
                new Audio('alarm.wav').play();

                if (notifyLabel === 'Pomodoro 完了') {
                    completedSessions = Math.min(completedSessions + 1, dots.length);
                    updateDots();
                }

                notifyUser(notifyLabel);
                stopBtn.textContent = '⏸ 一時停止';
            }
        }
    }, 1000);
}

function initializeTimer(duration, notifyLabel) {
    if (interval) clearInterval(interval);

    seconds = duration;
    totalSeconds = duration;
    isPaused = false;
    isRunning = true;

    updateDisplay();
    updateProgressBar(0);
    stopBtn.textContent = '⏸ 一時停止';

    startInterval(notifyLabel);
}

// ▶ 作業タイマー開始
startBtn.addEventListener('click', () => {
    const duration = parseInt(timeInput.value, 10) * 60;
    initializeTimer(duration, 'Pomodoro 完了');
});

// ☕ 休憩タイマー開始
breakBtn.addEventListener('click', () => {
    initializeTimer(5 * 60, '休憩終了');
});

// ⏸ 一時停止 / ▶ 再開
stopBtn.addEventListener('click', () => {
    if (!isRunning) return;
    isPaused = !isPaused;
    stopBtn.textContent = isPaused ? '▶ 再開' : '⏸ 一時停止';
    if (!interval && !isPaused) startInterval('再開後完了');
});

// ▼ ドロップダウン操作
mainButton.addEventListener('click', () => {
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown-button')) {
        dropdown.style.display = 'none';
    }
});
