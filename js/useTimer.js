const DEFAULT_START_TIME = "00:00:00";

// '00:00:30' => initHours = 0, initMinutes = 0, initSeconds = 30
function parseTimerParam(time) {
  if (!time) return { initHours: 0, initMinutes: 0, initSeconds: 0 };

  const arr = time.replace(/[^0-9:]/g, "").split(":");
  const initHours = arr?.[0] ? parseInt(arr[0]) : 0;
  const initMinutes = arr?.[1] ? parseInt(arr[1]) : 0;
  const initSeconds = arr?.[2] ? parseInt(arr[2]) : 0;

  return { initHours, initMinutes, initSeconds }
}

function getTotalSecond(hh, mm, ss) {
  return hh * 3600 + mm * 60 + ss;
}

function formatTime(time) {
  return String(time).padStart(2, "0");
};

export default function useTimer(startTime = DEFAULT_START_TIME) {
  const { initHours, initMinutes, initSeconds } = parseTimerParam(startTime);
  const initTotalSeconds = getTotalSecond(initHours, initMinutes, initSeconds);

  let hours = initHours;
  let minutes = initMinutes;
  let seconds = initSeconds;
  let totalSeconds = initTotalSeconds;

  
  let timerId = null;
  let running = false;
  const isCountDown = totalSeconds > 0;
  const elmTimer = document.getElementById('id-timer')


  function countDown() {
    if (totalSeconds === 0) return;

    if (totalSeconds === 1) {
      totalSeconds = 0;
      seconds = 0;
    } else {
      totalSeconds--;
      if (seconds > 0) {
        seconds--;
      } else if (minutes > 0) {
        seconds = 59;
        minutes--;
      } else if (hours > 0) {
        seconds = 59;
        minutes = 59;
        hours--;
      }
    }
  }

  function countUp() {
    totalSeconds++;

    if (seconds < 59) {
      seconds++;
    } else if (minutes < 59) {
      seconds = 0;
      minutes++;
    } else {
      seconds = 0;
      minutes = 0;
      hours++;
    }
  }

  function updateView() {
    elmTimer.innerHTML = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
  }

  function initView() {
    elmTimer.innerHTML = startTime
  }

  function run() {
    if (running) {
      if (isCountDown) {
        countDown();
      } else {
        countUp();
      }
      updateView();
    }
  }

  function start() {
    running = true;
    if (!timerId) {
      timerId = setInterval(() => {
        run();
      }, 1000);
    }
  }

  function reset() {
    running = false;
    totalSeconds = initTotalSeconds;
    hours = initHours
    minutes = initMinutes;
    seconds = initMinutes;
    initView();
  }

  function pause() {
    running = false;
  }

  function clear() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  return {
    initView,
    start,
    reset,
    pause,
    clear,
  }
}
