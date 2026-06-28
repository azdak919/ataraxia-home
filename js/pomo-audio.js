/* Ataraxia — pomo audio (keepalive + completion chime)
 *
 * Audio strategy (see commit 7d360fa + W3C Audio Session explainer):
 *   • Timer running  → ambient / silent keepalive — music keeps playing
 *   • Chime (notif)  → transient — ducks music like GPS, then releases
 *   • Android chime  → <audio> WAV + audio.load() on end to release focus
 *   • iOS timer      → full-duration WAV (ultrasonic + baked chime at end)
 *
 * Depends: pomo (runtime)
 * Exports: initAudioCtx, startTimerAudio, stopTimerAudio, playCompletionChime, _updateMediaSession
 */
/* ── Shared AudioContext (created on first user gesture) ── */
let _audioCtx = null;
function initAudioCtx() {
  if (_audioCtx) return _audioCtx;
  try {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e) {}
  return _audioCtx;
}

/* ── Screen Wake Lock — keeps screen on while timer runs so audio fires reliably ── */
let _wakeLock = null;
async function requestWakeLock() {
  try {
    if ('wakeLock' in navigator && document.visibilityState === 'visible') {
      _wakeLock = await navigator.wakeLock.request('screen');
      _wakeLock.addEventListener('release', () => { _wakeLock = null; });
    }
  } catch(e) {}
}
async function releaseWakeLock() {
  try { if (_wakeLock) { await _wakeLock.release(); _wakeLock = null; } } catch(e) {}
}

const _isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const _isAndroid = /Android/i.test(navigator.userAgent);

/* ── Audio Session API (iOS 17.2+) ─────────────────────────
   ambient    → timer keepalive mixes with Spotify
   transient  → chime ducks other audio briefly (GPS-like)
   auto       → UA default after chime / stop
   ───────────────────────────────────────────────────────── */
function _setAudioSession(type) {
  try {
    if (navigator.audioSession) navigator.audioSession.type = type;
  } catch(e) {}
}

function _enterChimeSession() {
  _setAudioSession('transient');
}

function _releaseAudioSession() {
  _setAudioSession('auto');
}

function _chimeDurationSec(isBreak) {
  return isBreak ? 4 : 5;
}

function _chimeLeadSec() {
  return _chimeDurationSec(pomo.isBreak) + 0.5;
}

function _maybePrepareChimeSession() {
  if (!_isIOS || !pomo.isRunning || !_timerAudio) return;
  const remaining = getRemaining();
  if (remaining > 0 && remaining <= _chimeLeadSec()) {
    _enterChimeSession();
  }
}

/* ── WAV encoding helper ── */
function _encodeWav(samples, sampleRate) {
  const n = samples.length;
  const buf = new ArrayBuffer(44 + n * 2);
  const v = new DataView(buf);
  const w = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  w(0,'RIFF'); v.setUint32(4, 36 + n*2, true); w(8,'WAVE');
  w(12,'fmt '); v.setUint32(16,16,true); v.setUint16(20,1,true);
  v.setUint16(22,1,true); v.setUint32(24,sampleRate,true);
  v.setUint32(28,sampleRate*2,true); v.setUint16(32,2,true);
  v.setUint16(34,16,true); w(36,'data'); v.setUint32(40,n*2,true);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    v.setInt16(44 + i*2, (s < 0 ? s * 0x8000 : s * 0x7FFF) | 0, true);
  }
  return new Blob([buf], { type: 'audio/wav' });
}

/* ── Keepalive state ── */
let _timerAudio = null;   // <audio> element (iOS)
let _timerBlobUrl = null;
let _keepaliveOsc = null;  // OscillatorNode (Android/Desktop)
let _keepaliveGain = null;

function _stopKeepaliveOsc() {
  if (_keepaliveOsc) {
    try { _keepaliveOsc.stop(); } catch(e) {}
    _keepaliveOsc = null;
  }
  if (_keepaliveGain) {
    try { _keepaliveGain.disconnect(); } catch(e) {}
    _keepaliveGain = null;
  }
}

/* ── Pre-render bowl-tone chime to WAV (Android + Desktop + iOS fallback) ── */
function _renderChimeWav(wasBreak) {
  const sr = 44100;
  const dur = wasBreak ? 4 : 5;
  const n = sr * dur;
  const buf = new Float32Array(n);
  const partials = [[1, 1], [2.756, 0.28], [5.404, 0.12]];

  function addTone(freq, startSec, vol, decaySec) {
    const attackSec = 0.008;
    const startSample = Math.round(startSec * sr);
    const endSample = Math.min(Math.round((startSec + decaySec) * sr), n);
    const k = Math.log(vol / 0.0001) / decaySec;

    for (let p = 0; p < partials.length; p++) {
      const pFreq = freq * partials[p][0];
      const pVol = partials[p][1];
      for (let i = startSample; i < endSample; i++) {
        const t = (i - startSample) / sr;
        let env;
        if (t < attackSec) {
          env = vol * (t / attackSec);
        } else {
          env = vol * Math.exp(-k * t);
        }
        buf[i] += Math.sin(2 * Math.PI * pFreq * t) * env * pVol;
      }
    }
  }

  if (wasBreak) {
    addTone(783.99, 0,    0.18, 3.0);
    addTone(659.25, 0.45, 0.12, 2.6);
  } else {
    addTone(523.25, 0,    0.20, 3.8);
    addTone(659.25, 0.50, 0.16, 3.4);
    addTone(783.99, 1.00, 0.13, 3.0);
  }

  for (let i = 0; i < n; i++) {
    if (buf[i] > 1) buf[i] = 1;
    else if (buf[i] < -1) buf[i] = -1;
  }
  return _encodeWav(buf, sr);
}

/* ── iOS: full-duration WAV — ultrasonic silence + chime at the end ── */
function _renderFullTimerWav(remainingSec, isBreak) {
  const sr = 44100;
  const n = sr * remainingSec;
  const buf = new Float32Array(n);
  const freq = 19500;

  for (let i = 0; i < n; i++) {
    buf[i] = Math.sin(2 * Math.PI * freq * i / sr) * 0.001;
  }

  const chimeDur = _chimeDurationSec(isBreak);
  const chimeStartSample = Math.max(0, n - sr * chimeDur);
  const partials = [[1, 1], [2.756, 0.28], [5.404, 0.12]];

  function addTone(baseFreq, startSec, vol, decaySec) {
    const attackSec = 0.008;
    const startSample = chimeStartSample + Math.round(startSec * sr);
    const endSample = Math.min(chimeStartSample + Math.round((startSec + decaySec) * sr), n);
    const k = Math.log(vol / 0.0001) / decaySec;
    for (let p = 0; p < partials.length; p++) {
      const pFreq = baseFreq * partials[p][0];
      const pVol = partials[p][1];
      for (let i = startSample; i < endSample; i++) {
        const t = (i - startSample) / sr;
        let env;
        if (t < attackSec) {
          env = vol * (t / attackSec);
        } else {
          env = vol * Math.exp(-k * t);
        }
        buf[i] += Math.sin(2 * Math.PI * pFreq * t) * env * pVol;
      }
    }
  }

  if (isBreak) {
    addTone(783.99, 0,    0.18, 3.0);
    addTone(659.25, 0.45, 0.12, 2.6);
  } else {
    addTone(523.25, 0,    0.20, 3.8);
    addTone(659.25, 0.50, 0.16, 3.4);
    addTone(783.99, 1.00, 0.13, 3.0);
  }

  for (let i = 0; i < n; i++) {
    if (buf[i] > 1) buf[i] = 1;
    else if (buf[i] < -1) buf[i] = -1;
  }
  return _encodeWav(buf, sr);
}

async function _playChimeViaAudio(wasBreak, onDone) {
  _enterChimeSession();
  _stopKeepaliveOsc();

  const blob = _renderChimeWav(wasBreak);
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.volume = 1.0;

  const cleanup = () => {
    try {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      URL.revokeObjectURL(url);
    } catch(e) {}
  };

  const finish = () => {
    cleanup();
    _releaseAudioSession();
    if (onDone) onDone();
  };

  try {
    await audio.play();
  } catch {
    cleanup();
    _releaseAudioSession();
    return false;
  }

  audio.addEventListener('ended', finish);
  audio.addEventListener('error', finish);
  return true;
}

async function _playChimeViaWebAudio(wasBreak) {
  _enterChimeSession();
  _stopKeepaliveOsc();
  try {
    const ctx = initAudioCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') await ctx.resume();
    if (ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const tones = wasBreak ? [523, 659, 784] : [784, 659, 523];
    let lastEnd = now;
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const t = now + i * 0.3;
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      osc.start(t);
      osc.stop(t + 1.2);
      lastEnd = t + 1.2;
    });
    setTimeout(() => _releaseAudioSession(), Math.max(0, (lastEnd - now) * 1000 + 100));
  } catch(e) {
    _releaseAudioSession();
  }
}

function startTimerAudio(remainingSec) {
  stopTimerAudio();

  if (_isIOS) {
    try {
      _setAudioSession('ambient');
      const blob = _renderFullTimerWav(remainingSec, pomo.isBreak);
      _timerBlobUrl = URL.createObjectURL(blob);
      _timerAudio = new Audio(_timerBlobUrl);
      _timerAudio.volume = 1.0;
      _timerAudio.loop = false;
      _timerAudio.addEventListener('ended', () => stopTimerAudio());
      const p = _timerAudio.play();
      if (p) p.catch(() => {});
    } catch(e) {}
  } else {
    try {
      const ctx = initAudioCtx();
      if (ctx) {
        if (ctx.state === 'suspended') ctx.resume();
        _keepaliveGain = ctx.createGain();
        _keepaliveGain.gain.value = 0.001;
        _keepaliveGain.connect(ctx.destination);
        _keepaliveOsc = ctx.createOscillator();
        _keepaliveOsc.type = 'sine';
        _keepaliveOsc.frequency.value = 19500;
        _keepaliveOsc.connect(_keepaliveGain);
        _keepaliveOsc.start();
      }
    } catch(e) {}
  }

  _updateMediaSession();
}

function stopTimerAudio() {
  if (_timerAudio) {
    try { _timerAudio.pause(); _timerAudio.removeAttribute('src'); _timerAudio.load(); } catch(e) {}
    _timerAudio = null;
  }
  if (_timerBlobUrl) {
    try { URL.revokeObjectURL(_timerBlobUrl); } catch(e) {}
    _timerBlobUrl = null;
  }
  _stopKeepaliveOsc();
  _releaseAudioSession();
  try { if ('mediaSession' in navigator) navigator.mediaSession.metadata = null; } catch(e) {}
}

/* ── Media Session API — iOS lock screen countdown only ── */
function _updateMediaSession() {
  if (!_isIOS || !('mediaSession' in navigator)) return;
  try {
    _maybePrepareChimeSession();

    const phase = pomo.isBreak ? (pomo.isLongBreak ? 'Long Break' : 'Break') : 'Focus';
    const remaining = formatMinutes(getRemaining());
    navigator.mediaSession.metadata = new MediaMetadata({
      title: phase + ' · ' + remaining + 'm remaining',
      artist: 'Ataraxia Pomodoro',
      artwork: [
        { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    });
    navigator.mediaSession.setActionHandler('pause', () => stopPomo());
    navigator.mediaSession.setActionHandler('play', () => startPomo());

    if (navigator.mediaSession.setPositionState && _timerAudio && _timerAudio.duration) {
      const totalDur = pomo.phaseDuration || pomo.totalSeconds;
      const elapsed = totalDur - getRemaining();
      navigator.mediaSession.setPositionState({
        duration: totalDur,
        playbackRate: 1,
        position: Math.max(0, Math.min(elapsed, totalDur))
      });
    }
  } catch(e) {}
}

/* ── Completion chime ── */
async function playCompletionChime(wasBreak) {
  try {
    if (_isIOS) {
      if (_timerAudio && !_timerAudio.paused && !_timerAudio.ended) {
        _enterChimeSession();
        return;
      }
      stopTimerAudio();
      await _playChimeViaAudio(wasBreak);
      return;
    }

    if (_audioCtx && _audioCtx.state === 'suspended') {
      try { await _audioCtx.resume(); } catch(e) {}
    }

    const played = await _playChimeViaAudio(wasBreak, stopTimerAudio);
    if (!played && _isAndroid) {
      await _playChimeViaWebAudio(wasBreak);
      stopTimerAudio();
    }
  } catch(e) {
    _releaseAudioSession();
    stopTimerAudio();
  }
}