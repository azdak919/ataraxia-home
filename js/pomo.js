/* Ataraxia — pomodoro timer
 * Depends: pomo-audio.js, storage.js
 * Exports: pomo, PomoUI, startPomo, stopPomo, resetPomo, initPomoHandlers, ...
 */
const CIRCUMFERENCE = 2 * Math.PI * 52; // ~326.73  (r=52 in 120×120 viewBox)
let pomo = loadPomoState();

function defaultPomoState() {
  return {
    workMin: 25,
    breakMin: 5,
    longBreakMin: 15,
    sessionsBeforeLong: 4,
    completedSessions: 0,
    isRunning: false,
    isBreak: false,
    startedAt: null,       // timestamp when current segment started
    pausedRemaining: null, // seconds remaining when paused
    totalSeconds: 25 * 60,
    phaseDuration: 25 * 60, // full duration of the current phase (for stop/reset)
    isLongBreak: false,
  };
}

function loadPomoState() {
  try {
    const raw = localStorage.getItem(POMO_KEY)
      || localStorage.getItem(POMO_KEY_LEGACY);
    if (raw) {
      const s = JSON.parse(raw);
      if (typeof s.workMin !== 'number') return defaultPomoState();
      // Timer en cours : rattraper toutes les phases expirées pendant l'absence.
      if (s.isRunning && s.startedAt && (s.totalSeconds || 0) > 0) {
        let elapsed = (Date.now() - s.startedAt) / 1000;
        let advanced = false;
        while (elapsed >= s.totalSeconds) {
          elapsed -= s.totalSeconds;
          advanced = true;
          if (!s.isBreak) {
            s.completedSessions = (s.completedSessions || 0) + 1;
            const isLong = s.completedSessions % (s.sessionsBeforeLong || 4) === 0;
            s.isBreak = true;
            s.isLongBreak = isLong;
            s.totalSeconds = (isLong ? s.longBreakMin : s.breakMin) * 60;
          } else {
            s.isBreak = false;
            s.isLongBreak = false;
            s.totalSeconds = s.workMin * 60;
          }
          s.phaseDuration = s.totalSeconds;
        }
        if (advanced) {
          s.isRunning = false;
          s.startedAt = null;
          s.phaseJustCompleted = true;
          s.pausedRemaining = Math.max(0, s.totalSeconds - elapsed);
        }
      }
      return s;
    }
  } catch(e) {}
  return defaultPomoState();
}

let _savePomoTimer = null;
function savePomoState() {
  // Debounce: coalesce rapid consecutive calls into a single write.
  // Critical state changes (start/stop/reset) still land within ~800 ms.
  clearTimeout(_savePomoTimer);
  _savePomoTimer = setTimeout(() => {
    localStorage.setItem(POMO_KEY, JSON.stringify(pomo));
  }, 800);
}
// Flush any pending debounced save immediately when the page is about to unload
// so state is never lost on tab close or browser crash.
window.addEventListener('pagehide', () => {
  clearTimeout(_savePomoTimer);
  localStorage.setItem(POMO_KEY, JSON.stringify(pomo));
});

function getRemaining() {
  if (!pomo.isRunning) {
    return pomo.pausedRemaining != null ? pomo.pausedRemaining : pomo.totalSeconds;
  }
  const elapsed = (Date.now() - pomo.startedAt) / 1000;
  return Math.max(0, pomo.totalSeconds - elapsed);
}

function formatMinutes(sec) {
  // Show only minutes — no seconds to avoid distraction
  if (sec <= 0) return '0';
  return String(Math.ceil(sec / 60));
}

// Tracks the last composite key used to render PomoUI so we can skip frames
// where nothing visible has changed, while still animating the progress ring.
let _lastPomoRenderKey = null;

function PomoUI() {
  const remaining = getRemaining();

  // ── 1. Completion check — must run every frame so the phase flip fires
  //       on the exact frame remaining hits zero, even before any DOM update.
  if (remaining <= 0 && pomo.isRunning) {
    onSegmentComplete();
  }

  // ── 2. Progress ring — always update for smooth 60 fps animation
  const fraction = 1 - (remaining / pomo.totalSeconds);
  const progress = document.getElementById('pomo-progress');
  if (progress) {
    progress.style.strokeDasharray = CIRCUMFERENCE;
    progress.style.strokeDashoffset = CIRCUMFERENCE * (1 - fraction);
  }

  const fpProgress = document.getElementById('pomo-fp-progress');
  if (fpProgress) {
    fpProgress.style.strokeDasharray = CIRCUMFERENCE;
    fpProgress.style.strokeDashoffset = CIRCUMFERENCE * (1 - fraction);
    fpProgress.classList.toggle('on-break', pomo.isBreak);
  }

  // ── 3. Guard: skip all remaining DOM work when nothing user-visible changed.
  //       The render key encodes every piece of state that affects the UI.
  //       formatMinutes() rounds to whole minutes, so the key changes ~once/min.
  const minStr = formatMinutes(remaining);
  const renderKey = `${minStr}|${pomo.isBreak}|${pomo.isLongBreak}|${pomo.isRunning}|${pomo.phaseJustCompleted}|${pomo.completedSessions}|${currentLang}`;
  if (_lastPomoRenderKey === renderKey) return;
  _lastPomoRenderKey = renderKey;

  // ── 4. Text / label / button updates (run ~once per minute or on state change)
  const display = document.getElementById('pomo-display');
  const label = document.getElementById('pomo-label');
  const playBtn = document.getElementById('pomo-play');
  const pauseBtn = document.getElementById('pomo-pause');
  const dotsEl = document.getElementById('pomo-dots');
  const readyLabel = document.getElementById('pomo-phase-ready');

  if (display) display.innerHTML = `${minStr}<span class="pomo-time-unit">m</span>`;

  // Update browser tab title with stage and time (emojis for quick recognition)
  const stageLabel = pomo.isBreak ? (pomo.isLongBreak ? 'Long Break' : 'Break') : 'Focus';
  const stageEmoji = pomo.isBreak ? (pomo.isLongBreak ? '🌿' : '☕') : '🎯';
  const pausedMark = !pomo.isRunning && (pomo.pausedRemaining != null || pomo.startedAt != null) ? '⏸ ' : '';
  document.title = `${pausedMark}${stageEmoji} ${stageLabel} · ${minStr}m · Ataraxia`;

  if (pomo.isBreak) {
    progress?.classList.add('on-break');
    label.textContent = pomo.isLongBreak ? 'Long Break' : 'Break';
    playBtn?.classList.add('on-break');
    pauseBtn?.classList.add('on-break');
  } else {
    progress?.classList.remove('on-break');
    label.textContent = 'Focus';
    playBtn?.classList.remove('on-break');
    pauseBtn?.classList.remove('on-break');
  }

  // Session progress dots
  if (dotsEl) {
    const total = pomo.sessionsBeforeLong;
    const done = pomo.completedSessions % pomo.sessionsBeforeLong;
    const breakClass = pomo.isBreak ? ' on-break' : '';
    dotsEl.innerHTML = Array.from({length: total}, (_, i) =>
      `<span class="pomo-dot${i < done ? ' done' + breakClass : ''}"></span>`
    ).join('');
  }

  if (pomo.isRunning) {
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'flex';
    // Clear phase-ready state once timer is running
    playBtn.classList.remove('phase-ready');
    if (readyLabel) { readyLabel.classList.remove('visible', 'on-break'); readyLabel.textContent = ''; }
  } else {
    playBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
    // Show phase-ready pulse when a phase just completed (phaseJustCompleted flag)
    if (pomo.phaseJustCompleted) {
      playBtn.classList.add('phase-ready');
      if (readyLabel) {
        readyLabel.textContent = pomo.isBreak ? 'Ready to break' : 'Ready to focus';
        readyLabel.classList.toggle('on-break', pomo.isBreak);
        readyLabel.classList.add('visible');
      }
    } else {
      playBtn.classList.remove('phase-ready');
      if (readyLabel) { readyLabel.classList.remove('visible', 'on-break'); readyLabel.textContent = ''; }
    }
  }

  // Sync full-page overlay
  const fpOverlay = document.getElementById('pomo-fullpage');
  if (fpOverlay) {
    const fpDisplay = document.getElementById('pomo-fp-display');
    const fpLabel = document.getElementById('pomo-fp-label');
    const fpPlay = document.getElementById('pomo-fp-play');
    const fpPause = document.getElementById('pomo-fp-pause');
    const fpDots = document.getElementById('pomo-fp-dots');
    const fpReady = document.getElementById('pomo-fp-phase-ready');

    if (fpDisplay) fpDisplay.innerHTML = `${minStr}<span class="pomo-time-unit">m</span>`;
    // fpProgress ring already updated above (step 2)
    if (fpLabel) fpLabel.textContent = pomo.isBreak ? (pomo.isLongBreak ? 'Long Break' : 'Break') : 'Focus';
    if (fpPlay) { fpPlay.classList.toggle('on-break', pomo.isBreak); }
    if (fpPause) { fpPause.classList.toggle('on-break', pomo.isBreak); }
    if (fpDots) {
      const total = pomo.sessionsBeforeLong;
      const done = pomo.completedSessions % pomo.sessionsBeforeLong;
      const breakClass = pomo.isBreak ? ' on-break' : '';
      fpDots.innerHTML = Array.from({length: total}, (_, i) =>
        `<span class="pomo-dot${i < done ? ' done' + breakClass : ''}"></span>`
      ).join('');
    }
    if (pomo.isRunning) {
      if (fpPlay) fpPlay.style.display = 'none';
      if (fpPause) fpPause.style.display = 'flex';
      if (fpPlay) fpPlay.classList.remove('phase-ready');
      if (fpReady) { fpReady.classList.remove('visible', 'on-break'); fpReady.textContent = ''; }
    } else {
      if (fpPlay) fpPlay.style.display = 'flex';
      if (fpPause) fpPause.style.display = 'none';
      if (pomo.phaseJustCompleted) {
        if (fpPlay) fpPlay.classList.add('phase-ready');
        if (fpReady) {
          fpReady.textContent = pomo.isBreak ? 'Ready to break' : 'Ready to focus';
          fpReady.classList.toggle('on-break', pomo.isBreak);
          fpReady.classList.add('visible');
        }
      } else {
        if (fpPlay) fpPlay.classList.remove('phase-ready');
        if (fpReady) { fpReady.classList.remove('visible', 'on-break'); fpReady.textContent = ''; }
      }
    }
  }
}

function onSegmentComplete() {
  pomo.isRunning = false;
  releaseWakeLock();
  // Don't stop timer audio here — the embedded chime is playing right now.
  // It will auto-cleanup via its 'ended' event when the chime finishes.
  const wasBreak = pomo.isBreak; // capture before phase flip

  // Notification — requireInteraction keeps it visible on Android lock screen
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(wasBreak ? 'Break over — time to focus!' : 'Session complete — take a break!', {
      icon: 'icon-192.png',
      badge: 'favicon-96x96.png',
      tag: 'ataraxia-pomo',
      requireInteraction: true,
      silent: false
    });
  }

  // Haptic feedback — works even when AudioContext is suspended on mobile
  if (navigator.vibrate) navigator.vibrate(wasBreak ? [150, 80, 150] : [200, 100, 200, 100, 400]);

  // Bell chime — async so AudioContext.resume() is properly awaited on mobile
  playCompletionChime(wasBreak);

  if (!pomo.isBreak) {
    pomo.completedSessions++;
    const isLong = pomo.completedSessions % pomo.sessionsBeforeLong === 0;
    pomo.isBreak = true;
    pomo.isLongBreak = isLong;
    pomo.totalSeconds = (isLong ? pomo.longBreakMin : pomo.breakMin) * 60;
    pomo.phaseDuration = pomo.totalSeconds;
  } else {
    pomo.isBreak = false;
    pomo.isLongBreak = false;
    pomo.totalSeconds = pomo.workMin * 60;
    pomo.phaseDuration = pomo.totalSeconds;
  }

  pomo.pausedRemaining = pomo.totalSeconds;
  pomo.startedAt = null;
  pomo.phaseJustCompleted = true;
  savePomoState();
}

function startPomo() {
  const remaining = pomo.pausedRemaining != null ? pomo.pausedRemaining : pomo.totalSeconds;
  pomo.startedAt = Date.now();
  pomo.totalSeconds = remaining; // recalculate from where we left off
  pomo.pausedRemaining = null;
  pomo.isRunning = true;
  pomo.phaseJustCompleted = false;
  savePomoState();
  initAudioCtx(); // ensure AudioContext is live after user gesture
  startTimerAudio(remaining); // iOS: keepalive audio; all: media session
  requestWakeLock(); // keep screen on so audio fires reliably

  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function stopPomo() {
  pomo.isRunning = false;
  pomo.startedAt = null;
  // Reset to the beginning of the current phase
  const full = pomo.phaseDuration || (pomo.isBreak ? pomo.breakMin * 60 : pomo.workMin * 60);
  pomo.pausedRemaining = full;
  pomo.totalSeconds = full;
  releaseWakeLock();
  stopTimerAudio();
  savePomoState();
}

function resetPomo() {
  pomo.isRunning = false;
  pomo.startedAt = null;
  pomo.isBreak = false;
  pomo.isLongBreak = false;
  pomo.totalSeconds = pomo.workMin * 60;
  pomo.phaseDuration = pomo.totalSeconds;
  pomo.pausedRemaining = pomo.totalSeconds;
  pomo.phaseJustCompleted = false;
  releaseWakeLock();
  stopTimerAudio();
  savePomoState();
}

function jumpToPhase(phase) {
  pomo.isRunning = false;
  pomo.startedAt = null;
  pomo.phaseJustCompleted = false;
  if (phase === 'focus') {
    pomo.isBreak = false;
    pomo.isLongBreak = false;
    pomo.totalSeconds = pomo.workMin * 60;
  } else if (phase === 'break') {
    pomo.isBreak = true;
    pomo.isLongBreak = false;
    pomo.totalSeconds = pomo.breakMin * 60;
  } else {
    pomo.isBreak = true;
    pomo.isLongBreak = true;
    pomo.totalSeconds = pomo.longBreakMin * 60;
  }
  pomo.phaseDuration = pomo.totalSeconds;
  pomo.pausedRemaining = pomo.totalSeconds;
  savePomoState();
  // Close settings panels
  document.getElementById('pomo-settings-panel')?.classList.remove('open');
  document.getElementById('pomo-fp-settings-panel')?.classList.remove('open');
  _lastPomoRenderKey = null;
  PomoUI();
}

/* Settings */
function loadSettingsUI() {
  document.getElementById('setting-work').value = pomo.workMin;
  document.getElementById('setting-break').value = pomo.breakMin;
  document.getElementById('setting-long').value = pomo.longBreakMin;
  document.getElementById('setting-sessions').value = pomo.sessionsBeforeLong;
}

function applySettings() {
  const w = parseInt(document.getElementById('setting-work').value) || 25;
  const b = parseInt(document.getElementById('setting-break').value) || 5;
  const l = parseInt(document.getElementById('setting-long').value) || 15;
  const s = parseInt(document.getElementById('setting-sessions').value) || 4;

  pomo.workMin = Math.max(1, Math.min(90, w));
  pomo.breakMin = Math.max(1, Math.min(30, b));
  pomo.longBreakMin = Math.max(1, Math.min(60, l));
  pomo.sessionsBeforeLong = Math.max(1, Math.min(12, s));

  if (!pomo.isRunning && !pomo.isBreak) {
    pomo.totalSeconds = pomo.workMin * 60;
    pomo.phaseDuration = pomo.totalSeconds;
    pomo.pausedRemaining = pomo.totalSeconds;
  }
  savePomoState();
  _lastPomoRenderKey = null;
  PomoUI();
}

/* Fullpage settings */
function loadFpSettingsUI() {
  document.getElementById('fp-setting-work').value = pomo.workMin;
  document.getElementById('fp-setting-break').value = pomo.breakMin;
  document.getElementById('fp-setting-long').value = pomo.longBreakMin;
  document.getElementById('fp-setting-sessions').value = pomo.sessionsBeforeLong;
}

function applyFpSettings() {
  const w = parseInt(document.getElementById('fp-setting-work').value) || 25;
  const b = parseInt(document.getElementById('fp-setting-break').value) || 5;
  const l = parseInt(document.getElementById('fp-setting-long').value) || 15;
  const s = parseInt(document.getElementById('fp-setting-sessions').value) || 4;

  pomo.workMin = Math.max(1, Math.min(90, w));
  pomo.breakMin = Math.max(1, Math.min(30, b));
  pomo.longBreakMin = Math.max(1, Math.min(60, l));
  pomo.sessionsBeforeLong = Math.max(1, Math.min(12, s));

  if (!pomo.isRunning && !pomo.isBreak) {
    pomo.totalSeconds = pomo.workMin * 60;
    pomo.phaseDuration = pomo.totalSeconds;
    pomo.pausedRemaining = pomo.totalSeconds;
  }
  savePomoState();
  _lastPomoRenderKey = null;
  PomoUI();
}

function openPomoFullscreen() {
  document.getElementById('pomo-fullpage')?.classList.add('open');
}

function initPomoHandlers() {
  const pomoContainer = document.querySelector('.pomo-container');
  if (pomoContainer) {
    pomoContainer.addEventListener('animationend', () => {
      pomoContainer.classList.add('anim-done');
    }, { once: true });
  }

  document.getElementById('pomo-play')?.addEventListener('click', () => { initAudioCtx(); startPomo(); });
  document.getElementById('pomo-pause')?.addEventListener('click', stopPomo);
  document.getElementById('pomo-reset')?.addEventListener('click', resetPomo);

  const settingsPanel = document.getElementById('pomo-settings-panel');
  document.getElementById('pomo-settings-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!settingsPanel) return;
    settingsPanel.classList.toggle('open');
    if (settingsPanel.classList.contains('open')) loadSettingsUI();
  });
  settingsPanel?.addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('click', (e) => {
    if (!settingsPanel?.classList.contains('open')) return;
    if (settingsPanel.contains(e.target) || e.target.closest('#pomo-settings-btn')) return;
    settingsPanel.classList.remove('open');
  });

  ['setting-work', 'setting-break', 'setting-long', 'setting-sessions'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', applySettings);
    el.addEventListener('input', applySettings);
  });

  document.getElementById('chip-focus')?.addEventListener('click', (e) => { e.stopPropagation(); jumpToPhase('focus'); });
  document.getElementById('chip-break')?.addEventListener('click', (e) => { e.stopPropagation(); jumpToPhase('break'); });
  document.getElementById('chip-long')?.addEventListener('click', (e) => { e.stopPropagation(); jumpToPhase('long'); });

  function tick() {
    try { PomoUI(); } catch(e) {}
    requestAnimationFrame(tick);
  }
  tick();

  setInterval(() => {
    if (pomo.isRunning) {
      _updateMediaSession();
      if (getRemaining() <= 0) {
        const doComplete = () => onSegmentComplete();
        if (_audioCtx && _audioCtx.state === 'suspended') {
          _audioCtx.resume().then(doComplete).catch(doComplete);
        } else {
          doComplete();
        }
      }
    }
  }, 1000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      if (_audioCtx && _audioCtx.state === 'suspended') _audioCtx.resume();
      PomoUI();
      if (pomo.isRunning) requestWakeLock();
    }
  });

  const fpOverlay = document.getElementById('pomo-fullpage');
  const pomoRingWrapper = document.querySelector('.pomo-widget .pomo-ring-wrapper');

  pomoRingWrapper?.addEventListener('click', (e) => {
    e.stopPropagation();
    openPomoFullscreen();
  });

  document.getElementById('pomo-fullscreen-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openPomoFullscreen();
  });

  document.getElementById('pomo-fullpage-close')?.addEventListener('click', () => {
    fpOverlay?.classList.remove('open');
    document.getElementById('pomo-fp-settings-panel')?.classList.remove('open');
  });

  fpOverlay?.addEventListener('click', (e) => {
    if (e.target === fpOverlay) {
      fpOverlay.classList.remove('open');
      document.getElementById('pomo-fp-settings-panel')?.classList.remove('open');
    }
  });

  document.getElementById('pomo-fp-play')?.addEventListener('click', () => { initAudioCtx(); startPomo(); });
  document.getElementById('pomo-fp-pause')?.addEventListener('click', stopPomo);
  document.getElementById('pomo-fp-reset')?.addEventListener('click', resetPomo);

  const fpSettingsPanel = document.getElementById('pomo-fp-settings-panel');
  document.getElementById('pomo-fp-settings-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!fpSettingsPanel) return;
    fpSettingsPanel.classList.toggle('open');
    if (fpSettingsPanel.classList.contains('open')) loadFpSettingsUI();
  });

  ['fp-setting-work', 'fp-setting-break', 'fp-setting-long', 'fp-setting-sessions'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('change', applyFpSettings);
    el.addEventListener('input', applyFpSettings);
  });

  document.getElementById('fp-chip-focus')?.addEventListener('click', () => jumpToPhase('focus'));
  document.getElementById('fp-chip-break')?.addEventListener('click', () => jumpToPhase('break'));
  document.getElementById('fp-chip-long')?.addEventListener('click', () => jumpToPhase('long'));

  document.getElementById('pomo-fp-settings-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    fpSettingsPanel?.classList.remove('open');
  });

  fpOverlay?.addEventListener('click', (e) => {
    if (fpSettingsPanel && !fpSettingsPanel.contains(e.target) && e.target.id !== 'pomo-fp-settings-btn') {
      fpSettingsPanel.classList.remove('open');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fpOverlay?.classList.contains('open')) {
      if (fpSettingsPanel?.classList.contains('open')) {
        fpSettingsPanel.classList.remove('open');
      } else {
        fpOverlay.classList.remove('open');
      }
    }
  });

  _lastPomoRenderKey = null;
  PomoUI();
}
