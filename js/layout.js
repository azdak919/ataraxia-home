/* ═══════════════════════════════════════════════════════
   Ataraxia — Layout module (js/layout.js)
   MODES: touch (tactile ≤900px) | wide (desktop >900px)
   Touch: Focus Deck — one scene at a time (timer | quote)
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const LAYOUT_MQS = {
    touch: '(pointer: coarse) and (max-width: 1024px), (pointer: coarse) and (max-height: 520px), (hover: none) and (max-width: 900px)',
    portrait: '(orientation: portrait)',
  };

  /** Pilules réduites — plafond largeur (téléphone moyen). */
  const PHONE_LAYOUT_MAX = 430;

  /** UI pleine largeur chrome — pomo/citation empilés (téléphone + petit viewport). */
  const PHONE_UI_MAX = 720;

  /** Tactile (téléphone / tablette) — layout Focus Deck, pas le wide desktop. */
  function isTouchViewport() {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const noHover = window.matchMedia('(hover: none)').matches;
    const w = window.innerWidth;
    const h = window.innerHeight;
    return (coarse && (w <= 1024 || h <= 520)) || (noHover && w <= 900);
  }

  const SCENE_KEY = 'ataraxia_scene';
  const LEGACY_SCENE_KEY = 'ataraxia_focus_scene';

  function migrateSceneStorage() {
    try {
      if (localStorage.getItem(SCENE_KEY) != null) return;
      const legacy = localStorage.getItem(LEGACY_SCENE_KEY) || 'timer';
      localStorage.setItem(SCENE_KEY, legacy === 'quote' ? 'quote' : 'timer');
      localStorage.removeItem(LEGACY_SCENE_KEY);
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

  function updateChromeInsets() {
    const root = document.documentElement;
    const bar = document.querySelector('.top-right-actions');
    const credits = document.querySelector('.bottom-badges');
    const gap = 10;
    root.style.setProperty('--chrome-inset-gap', `${gap}px`);

    if (bar) {
      const topPad = bar.getBoundingClientRect().bottom + gap;
      root.style.setProperty('--toolbar-offset', `${topPad}px`);
      root.style.setProperty('--content-pad-top', `${topPad}px`);
    }

    if (credits) {
      const rect = credits.getBoundingClientRect();
      const bottomPad = Math.max(0, window.innerHeight - rect.top + gap);
      root.style.setProperty('--content-pad-bottom', `${bottomPad}px`);
    }
  }

  let chromeInsetsObserver = null;

  function watchChromeInsets() {
    const bar = document.querySelector('.top-right-actions');
    const credits = document.querySelector('.bottom-badges');
    updateChromeInsets();
    if (typeof ResizeObserver === 'undefined') return;
    if (chromeInsetsObserver) chromeInsetsObserver.disconnect();
    chromeInsetsObserver = new ResizeObserver(() => updateChromeInsets());
    if (bar) chromeInsetsObserver.observe(bar);
    if (credits) chromeInsetsObserver.observe(credits);
  }

  function syncLayout() {
    const root = document.documentElement;
    const mode = isTouchViewport() ? 'touch' : 'wide';
    root.dataset.layout = mode;
    if (mode === 'touch') {
      syncScene();
    } else {
      delete root.dataset.scene;
    }
    requestAnimationFrame(watchChromeInsets);
  }

  function isTouchLayout() {
    return document.documentElement.dataset.layout === 'touch';
  }

  function initLayoutListeners() {
    const onLayoutChange = () => {
      syncLayout();
      updateChromeInsets();
      if (typeof window.scheduleQuoteLayout === 'function') {
        window.scheduleQuoteLayout();
      }
      if (typeof window.syncLandscapeFullscreen === 'function') {
        window.syncLandscapeFullscreen();
      }
      if (typeof window.syncWidgetScale === 'function') {
        window.syncWidgetScale();
      }
    };
    window.addEventListener('resize', onLayoutChange, { passive: true });
    window.addEventListener('orientationchange', onLayoutChange, { passive: true });
    window.matchMedia(LAYOUT_MQS.touch).addEventListener('change', onLayoutChange);
    window.matchMedia(LAYOUT_MQS.portrait).addEventListener('change', onLayoutChange);

    document.getElementById('scene-btn-timer')?.addEventListener('click', () => setScene('timer'));
    document.getElementById('scene-btn-quote')?.addEventListener('click', () => setScene('quote'));
  }

  function init() {
    migrateSceneStorage();
    syncLayout();
    watchChromeInsets();
    initLayoutListeners();
  }

  window.AtaraxiaLayout = {
    LAYOUT_MQS,
    SCENE_KEY,
    PHONE_LAYOUT_MAX,
    PHONE_UI_MAX,
    isTouchViewport,
    syncLayout,
    syncScene,
    setScene,
    isTouchLayout,
    updateChromeInsets,
    init,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();