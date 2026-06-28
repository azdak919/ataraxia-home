/* Ataraxia — bootstrap (sole orchestrator)
 *
 * MODULE MAP (js/):
 *   storage.js         — localStorage keys + legacy migration
 *   backgrounds-data.js— BACKGROUNDS[] image pool
 *   backgrounds.js     — load/switch backgrounds, smart random
 *   quotes-data.js     — QUOTES[] citation database
 *   quotes-i18n.js     — curated per-language quote translations
 *   quotes.js          — quote display, layout, random selection
 *   toast.js           — toast notifications
 *   pomo-audio.js      — AtaraxiaPomoAudio (keepalive + chime, isolé du timer)
 *   pomo.js            — pomodoro state, UI, fullscreen, settings
 *   translate.js       — auto-translation (quotes + UI strings)
 *   layout.js          — touch/wide layout + Focus Deck scenes
 *   panels.js          — minimize / restore pomo + quote panels
 *
 * Init order (DOMContentLoaded):
 *   layout.syncLayout → migrateLegacyStorage → initPanelMinimize
 *   → initPomoHandlers → backgrounds + quotes → translate
 */
let _quoteCardObserver = null;
window._ataraxiaPageStart = performance.now();
document.addEventListener('DOMContentLoaded', () => {
  if (window.AtaraxiaLayout) window.AtaraxiaLayout.syncLayout();
  migrateLegacyStorage();
  if (window.AtaraxiaPanels) window.AtaraxiaPanels.initPanelMinimize();
  // Pomo first — must not depend on quote init (quotes.js may load late or fail)
  initPomoHandlers();

  // Restore recent history for smart random selection (anti-repetition across sessions)
  try {
    const quoteCount = (typeof QUOTES !== 'undefined' && QUOTES.length) || 0;
    recentQuotes = JSON.parse(localStorage.getItem(RECENT_QUOTES_KEY) || '[]')
      .filter(i => Number.isInteger(i) && i >= 0 && i < quoteCount);
    recentBgs = JSON.parse(localStorage.getItem(RECENT_BGS_KEY) || '[]')
      .filter(i => Number.isInteger(i) && i >= 0 && i < BACKGROUNDS.length);
  } catch(e) {
    recentQuotes = [];
    recentBgs = [];
  }

  // One-time cleanup of author fields across the entire quote database.
  // This protects against any <g id="..."> leakage that may have been
  // present in the original data or introduced by previous translation runs.
  try {
    QUOTES.forEach(q => {
      if (q.author) q.author = cleanTranslation(q.author);
      if (q.authorEn) q.authorEn = cleanTranslation(q.authorEn);
    });
  } catch(e) {}

  // Random start — isolated so a missing quotes.js cannot break the pomo timer
  try {
    currentBgIdx = getRandomBgIndex(null);
    recordBgSeen(currentBgIdx);
    loadBackground(currentBgIdx);

    currentQuoteIdx = getRandomQuoteIndex();
    recordQuoteSeen(currentQuoteIdx);
    const _initQuote = QUOTES[currentQuoteIdx];
    document.getElementById('quote-text').textContent = _initQuote.text;
    const _initLangSaved = localStorage.getItem(LANG_PREF_KEY)
      || localStorage.getItem(LANG_PREF_KEY_LEGACY);
    const initAuthor = _initQuote.authorEn || _initQuote.author;
    document.getElementById('quote-author').textContent = cleanTranslation(initAuthor);
  } catch (e) {
    console.warn('Quote init failed:', e);
  }

  document.getElementById('home-reload-btn')?.addEventListener('click', () => location.reload());

  // Quote buttons
  document.getElementById('btn-new').addEventListener('click', showRandomQuote);
  document.getElementById('btn-bg').addEventListener('click', nextBackground);

  // Quote card resize observer
  const quoteCard = document.getElementById('quote-card');
  if (typeof ResizeObserver !== 'undefined' && quoteCard) {
    const quoteInner = quoteCard.querySelector('.quote-inner');
    _quoteCardObserver = new ResizeObserver(() => {
      if (!_quoteLayoutBusy) scheduleQuoteLayout();
    });
    _quoteCardObserver.observe(quoteCard);
    if (quoteInner) _quoteCardObserver.observe(quoteInner);
  }
  window.addEventListener('resize', () => scheduleQuoteLayout(), { passive: true });
  scheduleQuoteLayout();

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'q' || e.key === 'Q') showRandomQuote();
    if (e.key === 'b' || e.key === 'B') nextBackground();
    if (e.key === ' ') {
      e.preventDefault();
      pomo.isRunning ? stopPomo() : startPomo();
    }
  });

  // ═══════════════════════════════════════
  // INIT AUTO-TRANSLATE
  // ═══════════════════════════════════════
  initTranslation();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => console.warn('SW registration failed:', err));
  });
}
