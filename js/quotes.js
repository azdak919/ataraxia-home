/* Ataraxia — quote display & layout
 * Depends: quotes-data.js, translate.js (runtime)
 * Exports: showRandomQuote, scheduleQuoteLayout, getRandomQuoteIndex, ...
 */
let currentQuoteIdx = 0;
let recentQuotes = [];
const QUOTE_LAYOUT_MIN_PX = 13;
const QUOTE_LAYOUT_MAX_PX = 30;
const QUOTE_CROSSFADE_MS = 220;
let _quoteLayoutScheduled = false;
let _quoteLayoutBusy = false;
let _quoteLayoutCacheKey = '';
let _quoteSwapGen = 0;

function resetQuoteTypography() {
  const card = document.getElementById('quote-card');
  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  if (!card || !textEl || !authorEl) return;
  textEl.style.fontSize = '';
  authorEl.style.fontSize = '';
  card.style.removeProperty('--quote-text-size');
  card.style.removeProperty('--quote-author-size');
}

function invalidateQuoteLayout() {
  _quoteLayoutCacheKey = '';
  resetQuoteTypography();
  scheduleQuoteLayout();
}

function quoteLengthCapPx(len) {
  if (len <= 60) return 22;
  if (len <= 95) return 26;
  if (len <= 140) return 28;
  return QUOTE_LAYOUT_MAX_PX;
}

function quoteLayoutMaxPx(inner, available, textEl, authorEl, markEl) {
  const w = inner.clientWidth || 360;
  const len = (textEl.textContent || '').length;
  const charsPerLine = Math.max(14, Math.floor(w / 8.5));
  const lines = Math.max(1, Math.ceil(len / charsPerLine));
  const overhead = (markEl?.offsetHeight || 22) + (authorEl.offsetHeight || 18) + 20;
  const textBlock = available - overhead;
  const fromHeight = textBlock > 0 ? textBlock / (lines * 1.46) : 18;
  const fromWidth = w * 0.068;
  const lengthCap = quoteLengthCapPx(len);
  return Math.round(Math.min(QUOTE_LAYOUT_MAX_PX, lengthCap, Math.max(17, fromWidth, fromHeight)));
}

function syncQuoteLayout() {
  const card = document.getElementById('quote-card');
  const inner = card?.querySelector('.quote-inner');
  const body = card?.querySelector('.quote-body');
  const actions = card?.querySelector('.quote-action-row');
  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  const markEl = card?.querySelector('.quote-mark');
  if (!card || !inner || !body || !textEl || !authorEl) return;

  if (document.documentElement.dataset.layout === 'touch') return;

  const cacheKey = `${currentQuoteIdx}|${Math.round(inner.clientWidth)}|${Math.round(inner.clientHeight)}|${currentLang}`;
  if (_quoteLayoutCacheKey === cacheKey) return;

  _quoteLayoutBusy = true;

  requestAnimationFrame(() => {
    const innerH = inner.clientHeight;
    const actionsH = actions?.offsetHeight || 0;
    const gap = parseFloat(getComputedStyle(inner).rowGap || getComputedStyle(inner).gap) || 12;
    const available = innerH - actionsH - gap;
    if (available <= 0) {
      _quoteLayoutBusy = false;
      return;
    }

    body.style.maxHeight = `${available}px`;

    textEl.style.transition = 'none';
    authorEl.style.transition = 'none';

    let lo = QUOTE_LAYOUT_MIN_PX;
    let hi = quoteLayoutMaxPx(inner, available, textEl, authorEl, markEl);
    let best = lo;

    const fits = (size) => {
      textEl.style.fontSize = `${size}px`;
      authorEl.style.fontSize = `${Math.max(10, Math.round(size * 0.52))}px`;
      textEl.style.lineHeight = size < 16 ? '1.42' : '1.48';
      return body.scrollHeight <= available + 1;
    };

    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (fits(mid)) {
        best = mid;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    fits(best);

    textEl.style.transition = '';
    authorEl.style.transition = '';
    _quoteLayoutCacheKey = cacheKey;
    _quoteLayoutBusy = false;
  });
}

function scheduleQuoteLayout() {
  if (_quoteLayoutScheduled) return;
  _quoteLayoutScheduled = true;
  requestAnimationFrame(() => {
    _quoteLayoutScheduled = false;
    syncQuoteLayout();
  });
}
window.scheduleQuoteLayout = scheduleQuoteLayout;

async function resolveLocalizedQuote(quote, lang) {
  const authorBase = quote.authorEn || quote.author;
  if (lang === 'en') {
    return { text: quote.text, author: cleanTranslation(authorBase) };
  }
  const curated = QUOTE_I18N[quote.id]?.[lang];
  if (curated) {
    return {
      text: cleanTranslation(curated.text),
      author: cleanTranslation(curated.author || authorBase),
    };
  }
  const [translatedText, translatedAuthor] = await batchTranslate([quote.text, authorBase], lang);
  return {
    text: cleanTranslation(translatedText),
    author: cleanTranslation(translatedAuthor),
  };
}

function showRandomQuote() {
  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  const swapGen = ++_quoteSwapGen;

  textEl.style.opacity = '0';
  authorEl.style.opacity = '0';

  const idx = getRandomQuoteIndex();
  const quote = QUOTES[idx];
  const localizePromise = resolveLocalizedQuote(quote, currentLang);

  setTimeout(async () => {
    if (swapGen !== _quoteSwapGen) return;

    currentQuoteIdx = idx;
    recordQuoteSeen(idx);

    try {
      const localized = await localizePromise;
      if (swapGen !== _quoteSwapGen) return;
      textEl.textContent = localized.text;
      authorEl.textContent = localized.author;
    } catch (_) {
      if (swapGen !== _quoteSwapGen) return;
      const authorSrc = quote.authorEn || quote.author;
      textEl.textContent = quote.text;
      authorEl.textContent = cleanTranslation(authorSrc);
    }

    invalidateQuoteLayout();
    requestAnimationFrame(() => {
      if (swapGen !== _quoteSwapGen) return;
      textEl.style.opacity = '1';
      authorEl.style.opacity = '1';
    });
  }, QUOTE_CROSSFADE_MS + 16);
}
function recordQuoteSeen(idx) {
  recentQuotes = recentQuotes.filter(i => i !== idx);
  recentQuotes.push(idx);
  if (recentQuotes.length > MAX_RECENT_QUOTES) recentQuotes.shift();
  try { localStorage.setItem(RECENT_QUOTES_KEY, JSON.stringify(recentQuotes)); } catch(e) {}
}

function getRandomQuoteIndex() {
  const avoid = new Set(recentQuotes.slice(-MAX_RECENT_QUOTES));
  let candidates = Array.from({length: QUOTES.length}, (_, i) => i).filter(i => !avoid.has(i));

  // Safety: if we've seen almost everything recently, fall back to full pool
  if (candidates.length < 12) {
    candidates = Array.from({length: QUOTES.length}, (_, i) => i);
  }

  let idx = candidates[Math.floor(Math.random() * candidates.length)];

  // Hard avoid repeating the absolute current one if possible
  if (idx === currentQuoteIdx && candidates.length > 1) {
    idx = candidates[(candidates.indexOf(idx) + 1) % candidates.length];
  }
  return idx;
}
