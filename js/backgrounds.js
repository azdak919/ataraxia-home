/* Ataraxia — background loader & random selection
 * Depends: backgrounds-data.js, storage.js
 * Exports: loadBackground, nextBackground, getRandomBgIndex, recordBgSeen
 */
let currentBgIdx = 0;
let recentBgs = [];
const BG_CROSSFADE_MS = 900;

function safeHttpsUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const u = new URL(url.trim());
    return u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
}
// Return an appropriate image width for the current viewport + device pixel ratio.
// Capped at 2× DPR so 3× phones don't download 6000 px images.
function _responsiveImgWidth() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const vw = (window.innerWidth || screen.width) * dpr;
  if (vw <= 800)  return 800;
  if (vw <= 1280) return 1280;
  return 1920;
}

function loadBackground(index) {
  const bg = BACKGROUNDS[index];
  // Rewrite the width param in Unsplash / Pexels URLs to match the actual viewport,
  // saving 60-80 % bandwidth on phones and tablets.
  let url = bg.url;
  if (url.includes('w=1920')) {
    url = url.replace(/w=1920/g, 'w=' + _responsiveImgWidth());
  }
  _applyBackground(url, bg.credit, bg.link, bg.source || 'Unsplash', bg.title || '');
}

// Cleanup function for any in-progress background crossfade transition.
let _bgCrossfadeCleanup = null;
let _bgFadeTimer = null;

function _applyBackground(url, creditText, linkUrl, source, title = '') {
  const layerCurrent = document.getElementById('bg-layer');
  const layerNext    = document.getElementById('bg-layer-next');
  const credit       = document.getElementById('img-credit');

  const img = new Image();
  img.onload = () => {
    // If a previous crossfade is still in progress, finalize it immediately so
    // layerCurrent is up-to-date before we start the next transition.
    if (_bgCrossfadeCleanup) {
      _bgCrossfadeCleanup();
      _bgCrossfadeCleanup = null;
    }

    // Snap the incoming layer to opacity 0 (bypass the CSS transition) and
    // load the new image onto it, then re-enable the transition and fade in.
    layerNext.style.transition = 'none';
    layerNext.classList.remove('loaded');
    layerNext.style.backgroundImage = `url(${url})`;
    layerNext.offsetHeight; // read layout to force reflow and commit opacity:0 before re-enabling the transition
    layerNext.style.transition = '';
    layerNext.classList.add('is-fading');
    requestAnimationFrame(() => { layerNext.classList.add('loaded'); });

    // Persist current background URL so solitaire.html can share it
    try { localStorage.setItem('ataraxia_bg_url', url); } catch(e) {}

    // Safer DOM construction (was innerHTML). Prevents any future XSS risk and is more explicit.
    credit.textContent = '';
    const safeLink = safeHttpsUrl(linkUrl);
    if (source === 'Unsplash' || source === 'Pexels') {
      const titlePart = title ? `«${title}» · ` : '';
      credit.appendChild(document.createTextNode(`Photo: ${titlePart}`));
      if (safeLink) {
        const a = document.createElement('a');
        a.href = safeLink;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = creditText;
        credit.appendChild(a);
      } else {
        credit.appendChild(document.createTextNode(creditText));
      }
      credit.appendChild(document.createTextNode(` · ${source}`));
    } else if (safeLink) {
      const a = document.createElement('a');
      a.href = safeLink;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = creditText;
      credit.appendChild(a);
      credit.appendChild(document.createTextNode(` · ${source}`));
    } else {
      credit.appendChild(document.createTextNode(`${creditText} · ${source}`));
    }
    document.querySelector('.bottom-badges').classList.add('visible');
    requestAnimationFrame(() => window.AtaraxiaLayout?.updateChromeInsets?.());

    function finalizeCrossfade() {
      if (_bgFadeTimer) {
        clearTimeout(_bgFadeTimer);
        _bgFadeTimer = null;
      }
      layerNext.removeEventListener('transitionend', onTransitionEnd);
      _bgCrossfadeCleanup = null;
      layerCurrent.style.backgroundImage = `url(${url})`;
      layerNext.style.transition = 'none';
      layerNext.classList.remove('loaded', 'is-fading');
      layerNext.style.backgroundImage = '';
      requestAnimationFrame(() => { layerNext.style.transition = ''; });
    }

    function onTransitionEnd(e) {
      if (e.propertyName !== 'opacity' || e.target !== layerNext) return;
      finalizeCrossfade();
    }
    layerNext.addEventListener('transitionend', onTransitionEnd);
    _bgFadeTimer = setTimeout(finalizeCrossfade, BG_CROSSFADE_MS + 80);

    _bgCrossfadeCleanup = () => {
      finalizeCrossfade();
    };
  };
  img.onerror = () => {
    // Fallback to a randomly chosen pool entry to avoid always landing on the
    // same images when several consecutive entries in the list fail to load
    // (e.g. due to CDN hotlinking restrictions).
    _nextFromPool();
  };
  img.src = url;
}

function _nextFromPool() {
  const idx = getRandomBgIndex(null); // full pool, no culture preference
  currentBgIdx = idx;
  recordBgSeen(idx);
  loadBackground(idx);
}

function nextBackground() {
  _nextFromPool();
}
function recordBgSeen(idx) {
  recentBgs = recentBgs.filter(i => i !== idx);
  recentBgs.push(idx);
  if (recentBgs.length > MAX_RECENT_BGS) recentBgs.shift();
  try { localStorage.setItem(RECENT_BGS_KEY, JSON.stringify(recentBgs)); } catch(e) {}
}

function getRandomBgIndex(culture = null) {
  let pool = Array.from({length: BACKGROUNDS.length}, (_, i) => i);

  if (culture) {
    // Respect cultural preference (same logic as before, but on full pool first)
    const fallbacks = { 'east-asian': 'japanese', 'modern': null };
    const resolved = fallbacks[culture] !== undefined ? (fallbacks[culture] || culture) : culture;

    let cultPool = pool.filter(i => BACKGROUNDS[i].culture === resolved);
    if (cultPool.length === 0 && resolved !== culture) {
      cultPool = pool.filter(i => BACKGROUNDS[i].culture === culture);
    }
    if (cultPool.length === 0) {
      cultPool = pool.filter(i => !BACKGROUNDS[i].culture); // untagged nature
    }
    if (cultPool.length > 0) pool = cultPool;
  }

  const avoid = new Set(recentBgs.slice(-MAX_RECENT_BGS));
  let candidates = pool.filter(i => !avoid.has(i));

  if (candidates.length < 8) {
    candidates = pool; // relax window
  }

  let idx = candidates[Math.floor(Math.random() * candidates.length)];

  if (idx === currentBgIdx && candidates.length > 1) {
    idx = candidates[(candidates.indexOf(idx) + 1) % candidates.length];
  }
  return idx;
}
