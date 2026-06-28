/* Ataraxia — pomo audio (keepalive + completion chime)
 * Depends: pomo (runtime), initAudioCtx from pomo.js
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
let _timerBlobUrl = null;  // blob URL for iOS WAV
let _keepaliveOsc = null;  // OscillatorNode (Android/Desktop)
let _keepaliveGain = null; // GainNode for the oscillator

function _generateKeepaliveWav() {
  // 2-second loop at 44.1 kHz — ultrasonic 19.5 kHz sine, ~86 KB
  const sr = 44100;
  const dur = 2;
  const n = sr * dur;
  const samples = new Float32Array(n);
  const freq = 19500;
  for (let i = 0; i < n; i++) {
    samples[i] = Math.sin(2 * Math.PI * freq * i / sr) * 0.001;
  }
  return _encodeWav(samples, sr);
}

/* ── Pre-render bowl-tone chime to WAV (Android + Desktop) ── */
function _renderChimeWav(wasBreak) {
  const sr = 44100;
  const dur = wasBreak ? 4 : 5; // seconds — enough for full decay
  const n = sr * dur;
  const buf = new Float32Array(n);

  // Same bowl-tone parameters as the Web Audio synthesis version:
  // partials at [1×, 2.756×, 5.404×] with relative volumes [1, 0.28, 0.12]
  const partials = [[1, 1], [2.756, 0.28], [5.404, 0.12]];

  function addTone(freq, startSec, vol, decaySec) {
    const attackSec = 0.008;
    const startSample = Math.round(startSec * sr);
    const endSample = Math.min(Math.round((startSec + decaySec) * sr), n);
    const attackSamples = Math.round(attackSec * sr);
    // Exponential decay: from vol to 0.0001 over decaySec
    // vol * e^(-k*t) = 0.0001  =>  k = ln(vol/0.0001) / decaySec
    const k = Math.log(vol / 0.0001) / decaySec;

    for (let p = 0; p < partials.length; p++) {
      const pFreq = freq * partials[p][0];
      const pVol = partials[p][1];
      for (let i = startSample; i < endSample; i++) {
        const t = (i - startSample) / sr; // time since tone start
        // Envelope: linear attack, then exponential decay
        let env;
        if (t < attackSec) {
          env = vol * (t / attackSec); // linear ramp up
        } else {
          env = vol * Math.exp(-k * t); // exponential decay
        }
        buf[i] += Math.sin(2 * Math.PI * pFreq * t) * env * pVol;
      }
    }
  }

  if (wasBreak) {
    addTone(783.99, 0,    0.18, 3.0);  // G5 descending
    addTone(659.25, 0.45, 0.12, 2.6);  // E5
  } else {
    addTone(523.25, 0,    0.20, 3.8);  // C5 ascending
    addTone(659.25, 0.50, 0.16, 3.4);  // E5
    addTone(783.99, 1.00, 0.13, 3.0);  // G5
  }

  // Clamp to [-1, 1]
  for (let i = 0; i < n; i++) {
    if (buf[i] > 1) buf[i] = 1;
    else if (buf[i] < -1) buf[i] = -1;
  }

  return _encodeWav(buf, sr);
}

/* ── iOS: full-duration WAV — ultrasonic silence + chime at the end ──
   The WAV spans the entire timer. iOS shows it in Now Playing / lock screen
   with a progress bar = time remaining. The chime is baked into the last
   few seconds so no separate synthesis is needed at completion.           ── */
function _renderFullTimerWav(remainingSec, isBreak) {
  const sr = 44100;
  const n = sr * remainingSec;
  const buf = new Float32Array(n);

  // Fill with ultrasonic 19.5 kHz sine at near-zero amplitude (keepalive)
  const freq = 19500;
  for (let i = 0; i < n; i++) {
    buf[i] = Math.sin(2 * Math.PI * freq * i / sr) * 0.001;
  }

  // Overlay bowl-tone chime at the end
  const chimeDur = isBreak ? 4 : 5;
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
    addTone(783.99, 0,    0.18, 3.0);  // G5 descending
    addTone(659.25, 0.45, 0.12, 2.6);  // E5
  } else {
    addTone(523.25, 0,    0.20, 3.8);  // C5 ascending
    addTone(659.25, 0.50, 0.16, 3.4);  // E5
    addTone(783.99, 1.00, 0.13, 3.0);  // G5
  }

  // Clamp to [-1, 1]
  for (let i = 0; i < n; i++) {
    if (buf[i] > 1) buf[i] = 1;
    else if (buf[i] < -1) buf[i] = -1;
  }

  return _encodeWav(buf, sr);
}

function startTimerAudio(remainingSec) {
  stopTimerAudio();

  if (_isIOS) {
    // iOS: single full-duration WAV — ultrasonic silence + chime at the end.
    // iOS shows this in Now Playing / lock screen with a progress bar = time remaining.
    // audioSession 'ambient' allows mixing with Spotify / music (iOS 17.2+).
    try {
      if (navigator.audioSession) {
        try { navigator.audioSession.type = 'ambient'; } catch(e) {}
      }
      const blob = _renderFullTimerWav(remainingSec, pomo.isBreak);
      _timerBlobUrl = URL.createObjectURL(blob);
      _timerAudio = new Audio(_timerBlobUrl);
      _timerAudio.volume = 1.0;
      _timerAudio.loop = false;
      _timerAudio.addEventListener('ended', function() {
        // Chime has finished — release audio session cleanly
        stopTimerAudio();
      });
      var p = _timerAudio.play();
      if (p) p.catch(function() {});
    } catch(e) {}
  } else {
    // Android/Desktop: Web Audio API oscillator — does NOT steal audio focus
    try {
      const ctx = initAudioCtx();
      if (ctx) {
        if (ctx.state === 'suspended') ctx.resume();
        _keepaliveGain = ctx.createGain();
        _keepaliveGain.gain.value = 0.001; // minimal amplitude
        _keepaliveGain.connect(ctx.destination);
        _keepaliveOsc = ctx.createOscillator();
        _keepaliveOsc.type = 'sine';
        _keepaliveOsc.frequency.value = 19500; // ultrasonic — inaudible
        _keepaliveOsc.connect(_keepaliveGain);
        _keepaliveOsc.start();
      }
    } catch(e) {}
  }

  _updateMediaSession();
}

function stopTimerAudio() {
  // Stop iOS <audio> keepalive
  if (_timerAudio) {
    try { _timerAudio.pause(); _timerAudio.removeAttribute('src'); _timerAudio.load(); } catch(e) {}
    _timerAudio = null;
  }
  if (_timerBlobUrl) { try { URL.revokeObjectURL(_timerBlobUrl); } catch(e) {} _timerBlobUrl = null; }
  // Stop Android/Desktop oscillator keepalive
  if (_keepaliveOsc) {
    try { _keepaliveOsc.stop(); } catch(e) {}
    _keepaliveOsc = null;
  }
  if (_keepaliveGain) {
    try { _keepaliveGain.disconnect(); } catch(e) {}
    _keepaliveGain = null;
  }
  try { if ('mediaSession' in navigator) navigator.mediaSession.metadata = null; } catch(e) {}
}

/* ── Media Session API — shows timer in iOS lock screen / control center ── */
function _updateMediaSession() {
  if (!('mediaSession' in navigator)) return;
  try {
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
    // Position state — shows progress bar / countdown on iOS lock screen
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

/* ── Completion chime — platform-specific playback ──
   iOS:     Chime is baked into the full-duration WAV played by
            startTimerAudio() — no separate playback needed here.
   Android: Pre-rendered WAV via <audio> element — claims transient audio
            focus (AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK), ducking Waze /
            Spotify / podcasts briefly, then releasing.
   Desktop: Pre-rendered WAV via <audio> element — browsers treat <audio>
            as first-class media, reliable even in background tabs.
   ── */
async function playCompletionChime(wasBreak) {
  try {
    if (_isIOS) {
      // ── iOS: chime is baked into the full-duration timer WAV ──
      // If the WAV is still playing, the chime will sound naturally at the end.
      // If it was interrupted (call, audio session killed), fall through and play chime directly.
      if (_timerAudio && !_timerAudio.paused && !_timerAudio.ended) {
        return;
      }
      // WAV was interrupted — play the chime via a fresh <audio> element as fallback
      const blob = _renderChimeWav(wasBreak);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.volume = 1.0;
      const cleanup = () => {
        try { audio.pause(); audio.removeAttribute('src'); audio.load(); URL.revokeObjectURL(url); } catch(e) {}
      };
      audio.addEventListener('ended', cleanup);
      audio.addEventListener('error', cleanup);
      const p = audio.play();
      if (p) p.catch(() => cleanup());
      return;

    } else if (_isAndroid) {
      // ── Android: <audio> element with pre-rendered WAV ──
      // Resume AudioContext first — Chrome Android may suspend it in background,
      // which can also block HTMLAudioElement.play().
      if (_audioCtx && _audioCtx.state === 'suspended') {
        try { await _audioCtx.resume(); } catch(e) {}
      }
      const blob = _renderChimeWav(wasBreak);
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.volume = 1.0;
      const cleanup = () => {
        try {
          audio.pause();
          audio.removeAttribute('src');
          audio.load(); // forces Android Chrome to release audio focus
          URL.revokeObjectURL(url);
        } catch(e) {}
      };
      audio.addEventListener('ended', () => { cleanup(); stopTimerAudio(); });
      audio.addEventListener('error', () => { cleanup(); stopTimerAudio(); });
      var p = audio.play();
      if (p) p.catch(async () => {
        // HTMLAudioElement rejected (autoplay policy or audio focus lost) —
        // fall back to Web Audio API oscillator which bypasses autoplay restrictions
        // once the AudioContext has been resumed with a prior user gesture.
        cleanup();
        try {
          const ctx = initAudioCtx();
          if (ctx) {
            if (ctx.state === 'suspended') await ctx.resume();
            if (ctx.state === 'running') {
              const now = ctx.currentTime;
              const tones = wasBreak ? [523, 659, 784] : [784, 659, 523]; // C5-E5-G5
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
              });
            }
          }
        } catch(e2) {}
        stopTimerAudio();
      });

    } else {
      // ── Desktop (Windows / Mac / Linux): <audio> element with pre-rendered WAV ──
      // Browsers treat <audio> as first-class media that the OS audio
      // mixer respects regardless of tab focus — more reliable than
      // Web Audio API for background tabs.
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
      audio.addEventListener('ended', () => { cleanup(); stopTimerAudio(); });
      audio.addEventListener('error', () => { cleanup(); stopTimerAudio(); });
      var p = audio.play();
      if (p) p.catch(() => { cleanup(); stopTimerAudio(); });
    }
  } catch(e) {}
}
