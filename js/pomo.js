/* Ataraxia — pomodoro timer
 * Depends: pomo-audio.js (AtaraxiaPomoAudio), storage.js
 * Exports: pomo, PomoUI, startPomo, stopPomo, resetPomo, initPomoHandlers, ...
 */
const CIRCUMFERENCE = 2 * Math.PI * 52; // ~326.73  (r=52 in 120×120 viewBox)
let pomo = loadPomoState();

const PomoAudio = () => window.AtaraxiaPomoAudio;

/** Active le contexte audio (geste utilisateur requis la première fois). */
function primePomoAudio() {
  return PomoAudio()?.ensureAudioReady?.() ?? Promise.resolve(null);
}

function phoneLayoutMax() {
  return window.AtaraxiaLayout?.PHONE_UI_MAX ?? 720;
}

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

function _clampInt(n, min, max, fallback) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function _sanitizePomoState(s) {
  const d = defaultPomoState();
  const out = { ...d, ...s };
  out.workMin = _clampInt(out.workMin, 1, 90, d.workMin);
  out.breakMin = _clampInt(out.breakMin, 1, 30, d.breakMin);
  out.longBreakMin = _clampInt(out.longBreakMin, 1, 60, d.longBreakMin);
  out.sessionsBeforeLong = _clampInt(out.sessionsBeforeLong, 1, 12, d.sessionsBeforeLong);
  out.completedSessions = _clampInt(out.completedSessions, 0, 999, d.completedSessions);
  out.totalSeconds = _clampInt(out.totalSeconds, 0, 5400, d.totalSeconds);
  out.phaseDuration = _clampInt(out.phaseDuration, 0, 5400, d.phaseDuration);
  out.pausedRemaining = out.pausedRemaining == null
    ? null
    : _clampInt(out.pausedRemaining, 0, 5400, d.totalSeconds);
  out.isRunning = !!out.isRunning;
  out.isBreak = !!out.isBreak;
  out.isLongBreak = !!out.isLongBreak;
  out.phaseJustCompleted = !!out.phaseJustCompleted;
  out.startedAt = (typeof out.startedAt === 'number' && Number.isFinite(out.startedAt))
    ? out.startedAt
    : null;
  return out;
}

function loadPomoState() {
  try {
    const raw = localStorage.getItem(POMO_KEY)
      || localStorage.getItem(POMO_KEY_LEGACY);
    if (raw) {
      const s = _sanitizePomoState(JSON.parse(raw));
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
      return _sanitizePomoState(s);
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
  requestAnimationFrame(() => {
    if (typeof window.syncWidgetScale === 'function') window.syncWidgetScale();
  });

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
  PomoAudio()?.releaseWakeLock();
  // Ne pas stopTimerAudio ici — le chime iOS est dans le WAV ou joué juste après.
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

  PomoAudio()?.playCompletionChime(wasBreak);

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
  const audio = PomoAudio();
  if (audio) {
    void primePomoAudio().then(() => {
      audio.startTimerAudio(remaining);
      audio.requestWakeLock();
    });
  }

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
  const audio = PomoAudio();
  audio?.releaseWakeLock();
  audio?.stopTimerAudio();
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
  const audio = PomoAudio();
  audio?.releaseWakeLock();
  audio?.stopTimerAudio();
  savePomoState();
}

function jumpToPhase(phase) {
  const wasRunning = pomo.isRunning;
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
  if (wasRunning) {
    PomoAudio()?.releaseWakeLock();
    PomoAudio()?.stopTimerAudio();
  }
  savePomoState();
  setPomoSettingsOpen(false);
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

function setPomoSettingsOpen(open) {
  const panel = document.getElementById('pomo-settings-panel');
  const btn = document.getElementById('pomo-settings-btn');
  const fpBtn = document.getElementById('pomo-fp-settings-btn');
  if (!panel) return;
  panel.classList.toggle('open', open);
  panel.setAttribute('aria-hidden', open ? 'false' : 'true');
  btn?.setAttribute('aria-expanded', open ? 'true' : 'false');
  fpBtn?.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.classList.toggle('pomo-settings-open', open);
}

let _fpOpenedForLandscape = false;

const POMO_RING_EM = 28;
const POMO_OVERFLOW_EPS = 2;
let _pomoWideLatched = false;

/** phone = anneau em plein carré ; wide = compact ordinateur/tablette */
function setPomoScaleMode(mode) {
  const root = document.documentElement;
  const widget = document.getElementById('pomo-widget');
  if (mode === 'wide') {
    root.dataset.pomoScale = 'wide';
    widget?.style.removeProperty('--pw-base');
  } else {
    root.dataset.pomoScale = 'phone';
  }
}

/** Anneau, centre ou widget déborde → bascule mode tablette */
function detectPomoOverflow(widget) {
  if (!widget || widget.offsetParent === null) return false;
  const T = POMO_OVERFLOW_EPS;
  const wRect = widget.getBoundingClientRect();

  const ring = widget.querySelector('.pomo-ring-wrapper');
  if (ring) {
    const r = ring.getBoundingClientRect();
    if (r.width > wRect.width + T || r.height > wRect.height + T) return true;
    if (r.top < wRect.top - T || r.bottom > wRect.bottom + T) return true;
    if (r.left < wRect.left - T || r.right > wRect.right + T) return true;
  }

  const center = widget.querySelector('.pomo-center');
  if (center && (
    center.scrollHeight > center.clientHeight + T
    || center.scrollWidth > center.clientWidth + T
  )) return true;

  if (widget.scrollHeight > widget.clientHeight + T
    || widget.scrollWidth > widget.clientWidth + T) return true;

  return false;
}

/** Téléphone : --pw-base sur le widget ; bascule wide si overflow */
function syncWidgetScale() {
  const widget = document.getElementById('pomo-widget');
  const container = document.getElementById('pomo-container');
  if (!widget || !container) return;

  const maxW = phoneLayoutMax();
  if (window.innerWidth > maxW || container.classList.contains('is-minimized')) {
    delete document.documentElement.dataset.pomoScale;
    widget.style.removeProperty('--pw-base');
    return;
  }

  const quoteMinimized = document.getElementById('quote-card')?.classList.contains('is-minimized');

  /* Citation réduite → réessayer le remplissage (plus d'espace vertical) */
  if (quoteMinimized) _pomoWideLatched = false;

  /* Latch wide seulement si les deux panneaux sont visibles */
  if (_pomoWideLatched && !quoteMinimized) {
    setPomoScaleMode('wide');
    widget.style.removeProperty('--pw-base');
    return;
  }

  /** Anneau 28em + lignes fixes en em — évite dépassement quand citation réduite */
  function computeBase() {
    const rect = widget.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return null;

    const cs = getComputedStyle(widget);
    const padTop = parseFloat(cs.paddingTop);
    const padBottom = parseFloat(cs.paddingBottom);
    const padLeft = parseFloat(cs.paddingLeft);
    const padRight = parseFloat(cs.paddingRight);

    const phaseVisible = document.getElementById('pomo-phase-ready')?.classList.contains('visible');
    const gapEm = quoteMinimized ? 0.38 : 0.55;
    const phaseEm = phaseVisible ? 1.5 : 0;
    const ctrlRowEm = 4.2 + 0.35 + 0.2;
    const gapCount = phaseVisible ? 2 : 1;
    const nonRingEm = phaseEm + ctrlRowEm + gapEm * gapCount;

    const availW = rect.width - padLeft - padRight;
    const availInnerH = rect.height - padTop - padBottom;
    const baseFromW = availW / POMO_RING_EM;
    const baseFromH = availInnerH / (POMO_RING_EM + nonRingEm);
    const minBase = 96 / POMO_RING_EM;

    return Math.max(minBase, Math.min(baseFromW, baseFromH));
  }

  function fitPhoneScale() {
    setPomoScaleMode('phone');
    let base = computeBase();
    if (base == null) return;

    widget.style.setProperty('--pw-base', `${base}px`);

    const shrink = () => {
      if (window.innerWidth > maxW || container.classList.contains('is-minimized')) return;
      let iter = 0;
      while (detectPomoOverflow(widget) && iter < 16) {
        base = Math.max(96 / POMO_RING_EM, base * 0.92);
        widget.style.setProperty('--pw-base', `${base}px`);
        iter++;
      }
      if (detectPomoOverflow(widget)) {
        if (!quoteMinimized) _pomoWideLatched = true;
        setPomoScaleMode('wide');
      } else {
        _pomoWideLatched = false;
      }
    };

    requestAnimationFrame(() => requestAnimationFrame(shrink));
  }

  fitPhoneScale();
}

/** Calcule --fp-base en px : anneau + contrôles proportionnels en em */
function syncFullscreenScale() {
  const overlay = document.getElementById('pomo-fullpage');
  if (!overlay?.classList.contains('open')) return;

  const isWide = document.documentElement.dataset.layout === 'wide';
  const ringEm = isWide ? 32 : 28;
  const pad = 16;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const cs = getComputedStyle(overlay);
  const safeT = parseFloat(cs.getPropertyValue('--fp-safe-t')) || pad;
  const safeB = parseFloat(cs.getPropertyValue('--fp-safe-b')) || pad;

  const actions = overlay.querySelector('.pomo-fullpage-actions');
  const phaseEl = document.getElementById('pomo-fp-phase-ready');
  const phaseH = (phaseEl && phaseEl.classList.contains('visible'))
    ? phaseEl.getBoundingClientRect().height + 8
    : 0;
  const actionsH = actions?.getBoundingClientRect().height ?? 0;
  const rowGap = 12;

  const availW = vw - pad * 2;
  const availH = vh - safeT - safeB - actionsH - phaseH - rowGap - 40;

  const ringPx = Math.max(160, Math.min(availW, availH));
  const basePx = ringPx / ringEm;

  overlay.style.setProperty('--fp-base', `${basePx}px`);
}

function setPomoFullscreenOpen(open) {
  const overlay = document.getElementById('pomo-fullpage');
  if (!overlay) return;
  overlay.classList.toggle('open', open);
  document.body.classList.toggle('pomo-fullpage-open', open);
  setPomoSettingsOpen(false);
  if (!open) {
    _fpOpenedForLandscape = false;
    overlay.style.removeProperty('--fp-base');
  } else {
    requestAnimationFrame(() => {
      syncFullscreenScale();
      requestAnimationFrame(syncFullscreenScale);
    });
  }
}

/** Tactile : ouvre le plein écran en paysage, referme au retour portrait si auto-ouvert. */
function syncLandscapeFullscreen() {
  if (!window.AtaraxiaLayout?.isTouchLayout?.()) return;
  const landscape = window.matchMedia('(orientation: landscape)').matches;
  const overlay = document.getElementById('pomo-fullpage');
  if (!overlay) return;
  const isOpen = overlay.classList.contains('open');

  if (landscape) {
    if (!isOpen) {
      setPomoFullscreenOpen(true);
      _fpOpenedForLandscape = true;
    }
  } else if (_fpOpenedForLandscape && isOpen) {
    setPomoFullscreenOpen(false);
  }
}

function openPomoFullscreen() {
  setPomoFullscreenOpen(true);
}

function initPomoHandlers() {
  const audioApi = PomoAudio();
  if (!audioApi) {
    console.warn('[Ataraxia] pomo-audio.js missing — timer chime disabled');
  }
  audioApi?.init({
    getPomoState: () => pomo,
    getRemaining,
    formatMinutes,
    onPlay: startPomo,
    onPause: stopPomo,
  });

  const pomoContainer = document.querySelector('.pomo-container');
  if (pomoContainer) {
    pomoContainer.addEventListener('animationend', () => {
      pomoContainer.classList.add('anim-done');
    }, { once: true });
  }

  document.getElementById('pomo-play')?.addEventListener('click', () => startPomo());
  document.getElementById('pomo-pause')?.addEventListener('click', stopPomo);
  document.getElementById('pomo-reset')?.addEventListener('click', resetPomo);

  const settingsPanel = document.getElementById('pomo-settings-panel');
  document.getElementById('pomo-settings-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!settingsPanel) return;
    const open = !settingsPanel.classList.contains('open');
    setPomoSettingsOpen(open);
    if (open) loadSettingsUI();
  });
  settingsPanel?.addEventListener('click', (e) => e.stopPropagation());

  document.getElementById('pomo-settings-close')?.addEventListener('click', (e) => {
    e.stopPropagation();
    setPomoSettingsOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (!settingsPanel?.classList.contains('open')) return;
    if (
      settingsPanel.contains(e.target)
      || e.target.closest('#pomo-settings-btn')
      || e.target.closest('#pomo-fp-settings-btn')
    ) return;
    setPomoSettingsOpen(false);
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
      PomoAudio()?.updateMediaSession();
      if (getRemaining() <= 0) {
        const doComplete = () => onSegmentComplete();
        const audio = PomoAudio();
        if (audio?.isAudioSuspended()) {
          audio.resumeAudioCtx().then(doComplete).catch(doComplete);
        } else {
          doComplete();
        }
      }
    }
  }, 1000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      PomoAudio()?.resumeAudioCtx();
      PomoUI();
      if (pomo.isRunning) PomoAudio()?.requestWakeLock();
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
    setPomoFullscreenOpen(false);
  });

  fpOverlay?.addEventListener('click', (e) => {
    if (e.target !== fpOverlay) return;
    if (settingsPanel?.classList.contains('open')) return;
    setPomoFullscreenOpen(false);
  });

  document.getElementById('pomo-fp-play')?.addEventListener('click', (e) => {
    e.stopPropagation();
    startPomo();
  });
  document.getElementById('pomo-fp-pause')?.addEventListener('click', (e) => {
    e.stopPropagation();
    stopPomo();
  });
  document.getElementById('pomo-fp-reset')?.addEventListener('click', (e) => {
    e.stopPropagation();
    resetPomo();
  });

  document.getElementById('pomo-fp-settings-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = !settingsPanel?.classList.contains('open');
    setPomoSettingsOpen(open);
    if (open) loadSettingsUI();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && settingsPanel?.classList.contains('open')) {
      setPomoSettingsOpen(false);
      return;
    }
    if (e.key === 'Escape' && fpOverlay?.classList.contains('open')) {
      setPomoFullscreenOpen(false);
    }
  });

  window.syncLandscapeFullscreen = syncLandscapeFullscreen;
  window.syncFullscreenScale = syncFullscreenScale;
  window.syncWidgetScale = syncWidgetScale;
  syncLandscapeFullscreen();
  syncWidgetScale();

  const pomoContainerEl = document.getElementById('pomo-container');
  const pomoWidgetEl = document.getElementById('pomo-widget');
  if (typeof ResizeObserver !== 'undefined') {
    const widgetScaleObserver = new ResizeObserver(() => syncWidgetScale());
    if (pomoContainerEl) widgetScaleObserver.observe(pomoContainerEl);
    if (pomoWidgetEl) widgetScaleObserver.observe(pomoWidgetEl);
  }

  window.addEventListener('resize', () => {
    syncFullscreenScale();
    syncWidgetScale();
  }, { passive: true });
  window.addEventListener('orientationchange', () => {
    requestAnimationFrame(() => {
      syncFullscreenScale();
      syncWidgetScale();
    });
  }, { passive: true });

  _lastPomoRenderKey = null;
  PomoUI();

  // Timer repris après rechargement : réarme le keepalive (chime fiable en fin de phase)
  if (pomo.isRunning && getRemaining() > 0 && audioApi) {
    const rem = getRemaining();
    void audioApi.resumeAudioCtx().then(() => {
      if (pomo.isRunning && getRemaining() > 0) {
        audioApi.startTimerAudio(rem);
        audioApi.requestWakeLock();
      }
    });
  }
}
