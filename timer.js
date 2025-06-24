const startBtn = document.getElementById('start-timer');
const stopBtn = document.getElementById('stop-timer');
const timeInput = document.getElementById('work-minutes');
const display = document.getElementById('timer-display');

let interval = null;
let seconds = 0;
let isPaused = false;

function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
}

function updateDisplay() {
    display.textContent = formatTime(seconds);
}

// スタートボタン
startBtn.addEventListener('click', () => {
    if (interval) clearInterval(interval);

    seconds = parseInt(timeInput.value, 10) * 60;
    isPaused = false;
    updateDisplay();

    interval = setInterval(() => {
        if (!isPaused) {
            seconds--;
            updateDisplay();

            if (seconds <= 0) {
                clearInterval(interval);
                interval = null;
                new Audio('alarm.wav').play();
                if (window.safeAPI) {
                    window.safeAPI.notify('Pomodoro 完了', '時間になりました！休憩を取りましょう。');
                }
            }
        }
    }, 1000);
});

// ストップボタン（切り替え式：一時停止 ⇄ 再開）
stopBtn.addEventListener('click', () => {
    if (interval) {
        isPaused = !isPaused;
        stopBtn.textContent = isPaused ? '▶ 再開' : '⏸ 一時停止';
    }
});
