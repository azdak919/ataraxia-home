/* Ataraxia — storage keys & legacy migration
 * Exports: POMO_KEY, LANG_PREF_KEY, RECENT_*_KEY, migrateLegacyStorage
 */
const POMO_KEY = 'ataraxia_pomo';
const POMO_KEY_LEGACY = 'stoicflow_pomo';
const RECENT_QUOTES_KEY = 'ataraxia_recent_quotes_v2';
const RECENT_BGS_KEY    = 'ataraxia_recent_bgs_v2';
const MAX_RECENT_QUOTES = 26;   // good variety on 125 quotes (~21%)
const MAX_RECENT_BGS    = 25;   // on 182 backgrounds
const TRANSLATION_CACHE_KEY = 'ataraxia_translations_v3';
const TRANSLATION_CACHE_KEY_LEGACY = 'stoicflow_translations';
const LANG_PREF_KEY = 'ataraxia_lang';
const LANG_PREF_KEY_LEGACY = 'stoicflow_lang';
const POMO_MIN_KEY = 'ataraxia_pomo_minimized';
const QUOTE_MIN_KEY = 'ataraxia_quote_minimized';
const TRANSLATION_CACHE_MAX = 500;

function migrateLegacyStorage() {
  const pairs = [
    [POMO_KEY_LEGACY, POMO_KEY],
    [LANG_PREF_KEY_LEGACY, LANG_PREF_KEY],
    [TRANSLATION_CACHE_KEY_LEGACY, TRANSLATION_CACHE_KEY],
  ];
  pairs.forEach(([legacy, current]) => {
    try {
      const value = localStorage.getItem(legacy);
      if (value != null && localStorage.getItem(current) == null) {
        localStorage.setItem(current, value);
      }
    } catch(e) {}
  });
}
