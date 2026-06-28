/* ═══════════════════════════════════════════════════════
   Ataraxia — Layout module (js/layout.js)
   MODES: touch (tactile ≤900px) | wide (desktop >900px)
   Touch: Focus Deck — one scene at a time (timer | quote)
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const LAYOUT_MQS = {
    touch: '(hover: none) and (max-width: 900px)',
  };

  const SCENE_KEY = 'ataraxia_scene';
  const LEGACY_SCENE_KEY = 'ataraxia_focus_scene';

  function migrateSceneStorage() {
    try {
      if (localStorage.getItem(SCENE_KEY) != null) return;
      const legacy =
        localStorage.getItem(LEGACY_SCENE_KEY)
        || (localStorage.getItem('ataraxia_quote_minimized') === 'true' ? 'quote' : null)
        || (localStorage.getItem('ataraxia_pomo_minimized') === 'true' ? 'timer' : null)
        || 'timer';
      localStorage.setItem(SCENE_KEY, legacy === 'quote' ? 'quote' : 'timer');
      localStorage.removeItem(LEGACY_SCENE_KEY);
      localStorage.removeItem('ataraxia_quote_minimized');
      localStorage.removeItem('ataraxia_pomo_minimized');
    } catch (e) {}
  }

  function updateSceneTabState(scene) {
    const timerBtn = document.getElementById('scene-btn-timer');
    const quoteBtn = document.getElementById('scene-btn-quote');
    if (!timerBtn || !quoteBtn) return;
    const isTimer = scene === 'timer';
    timerBtn.classList.toggle('active', isTimer);
    quoteBtn.classList.toggle('active', !isTimer);
    timerBtn.setAttribute('aria-selected', isTimer ? 'true' : 'false');
    quoteBtn.setAttribute('aria-selected', isTimer ? 'false' : 'true');
  }

  function syncScene() {
    const root = document.documentElement;
    if (root.dataset.layout !== 'touch') {
      delete root.dataset.scene;
      return;
    }
    migrateSceneStorage();
    const saved = localStorage.getItem(SCENE_KEY);
    const scene = saved === 'quote' ? 'quote' : 'timer';
    root.dataset.scene = scene;
    updateSceneTabState(scene);
    if (scene === 'quote' && typeof window.scheduleQuoteLayout === 'function') {
      window.scheduleQuoteLayout();
    }
  }

  function setScene(scene) {
    const root = document.documentElement;
    if (root.dataset.layout !== 'touch') return;
    const next = scene === 'quote' ? 'quote' : 'timer';
    root.dataset.scene = next;
    try { localStorage.setItem(SCENE_KEY, next); } catch (e) {}
    updateSceneTabState(next);
    if (next === 'quote' && typeof window.scheduleQuoteLayout === 'function') {
      window.scheduleQuoteLayout();
    }
  }

  function syncLayout() {
    const root = document.documentElement;
    const mode = window.matchMedia(LAYOUT_MQS.touch).matches ? 'touch' : 'wide';
    root.dataset.layout = mode;
    if (mode === 'touch') syncScene();
    else delete root.dataset.scene;
  }

  function isTouchLayout() {
    return document.documentElement.dataset.layout === 'touch';
  }

  function initLayoutListeners() {
    const onLayoutChange = () => {
      syncLayout();
      if (typeof window.scheduleQuoteLayout === 'function') {
        window.scheduleQuoteLayout();
      }
    };
    window.addEventListener('resize', onLayoutChange, { passive: true });
    window.addEventListener('orientationchange', onLayoutChange, { passive: true });
    window.matchMedia(LAYOUT_MQS.touch).addEventListener('change', onLayoutChange);

    document.getElementById('scene-btn-timer')?.addEventListener('click', () => setScene('timer'));
    document.getElementById('scene-btn-quote')?.addEventListener('click', () => setScene('quote'));
  }

  function init() {
    migrateSceneStorage();
    syncLayout();
    initLayoutListeners();
  }

  window.AtaraxiaLayout = {
    LAYOUT_MQS,
    SCENE_KEY,
    syncLayout,
    syncScene,
    setScene,
    isTouchLayout,
    init,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();