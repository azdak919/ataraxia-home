/* Ataraxia — auto-translation (quotes + UI)
 * Depends: pomo.js, quotes.js, toast.js
 * Exports: initTranslation, cleanTranslation, switchLanguage, currentLang
 */
const SUPPORTED_LANGS = [
  { code: 'en', name: 'English',    native: 'English' },
  { code: 'es', name: 'Spanish',    native: 'Español' },
  { code: 'fr', name: 'French',     native: 'Français' },
  { code: 'de', name: 'German',     native: 'Deutsch' },
  { code: 'it', name: 'Italian',    native: 'Italiano' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'nl', name: 'Dutch',      native: 'Nederlands' },
  { code: 'ru', name: 'Russian',    native: 'Русский' },
  { code: 'ja', name: 'Japanese',   native: '日本語' },
  { code: 'ko', name: 'Korean',     native: '한국어' },
  { code: 'zh', name: 'Chinese',    native: '中文' },
  { code: 'ar', name: 'Arabic',     native: 'العربية' },
  { code: 'hi', name: 'Hindi',      native: 'हिन्दी' },
  { code: 'tr', name: 'Turkish',    native: 'Türkçe' },
  { code: 'pl', name: 'Polish',     native: 'Polski' },
  { code: 'uk', name: 'Ukrainian',  native: 'Українська' },
  { code: 'sv', name: 'Swedish',    native: 'Svenska' },
  { code: 'da', name: 'Danish',     native: 'Dansk' },
  { code: 'no', name: 'Norwegian',  native: 'Norsk' },
  { code: 'fi', name: 'Finnish',    native: 'Suomi' },
  { code: 'el', name: 'Greek',      native: 'Ελληνικά' },
  { code: 'he', name: 'Hebrew',     native: 'עברית' },
  { code: 'th', name: 'Thai',       native: 'ไทย' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay',      native: 'Bahasa Melayu' },
  { code: 'ro', name: 'Romanian',   native: 'Română' },
  { code: 'cs', name: 'Czech',      native: 'Čeština' },
  { code: 'hu', name: 'Hungarian',  native: 'Magyar' },
  { code: 'bg', name: 'Bulgarian',  native: 'Български' },
];

// UI strings that need translation
const UI_STRINGS = {
  en: {
    newQuote: 'New Quote',
    newScene: 'New Scene',
    focus: 'Focus',
    break: 'Break',
    timerSettings: 'Timer Settings',
    focusMin: 'Focus (min)',
    breakMin: 'Break (min)',
    longBreak: 'Long break',
    sessions: 'Sessions',
    jumpToPhase: 'Jump to phase',
    longBreakLabel: 'Long Break',
    sessionDone: 'Session done — short break',
    longBreakMsg: 'sessions done — long break!',
    breakOver: "Break over — let's focus",
    readyBreak: 'Ready to break',
    readyFocus: 'Ready to focus',
    quote: 'Quote',
    pomodoro: 'Pomodoro',
    solitaireBtn: 'Solitaire',
    radarBtn: 'Le Radar',
    coffeeBtn: 'Buy me a coffee',
    homeReload: 'Reload page',
    minimizePomo: 'Minimize timer',
    restorePomo: 'Restore timer',
    minimizeQuote: 'Minimize quote',
    restoreQuote: 'Restore quote',
  },
  fr: {
    newQuote: 'Nouvelle citation',
    newScene: 'Nouvelle scène',
    focus: 'Concentration',
    break: 'Pause',
    timerSettings: 'Paramètres du minuteur',
    focusMin: 'Concentration (min)',
    breakMin: 'Pause (min)',
    longBreak: 'Grande pause',
    sessions: 'Séances',
    jumpToPhase: 'Passer à la phase',
    longBreakLabel: 'Grande pause',
    sessionDone: 'Séance terminée — courte pause',
    longBreakMsg: 'séances terminées — grande pause !',
    breakOver: 'Pause terminée — concentrons-nous',
    readyBreak: 'Prêt pour la pause',
    readyFocus: 'Prêt à se concentrer',
    quote: 'Citation',
    pomodoro: 'Pomodoro',
    solitaireBtn: 'Solitaire',
    radarBtn: 'Le Radar',
    coffeeBtn: 'Offrir un café',
    homeReload: 'Recharger la page',
    minimizePomo: 'Réduire le minuteur',
    restorePomo: 'Agrandir le minuteur',
    minimizeQuote: 'Réduire la citation',
    restoreQuote: 'Agrandir la citation',
  },
  es: {
    newQuote: 'Nueva cita',
    newScene: 'Nueva escena',
    focus: 'Enfoque',
    break: 'Descanso',
    timerSettings: 'Ajustes del temporizador',
    focusMin: 'Enfoque (min)',
    breakMin: 'Descanso (min)',
    longBreak: 'Descanso largo',
    sessions: 'Sesiones',
    jumpToPhase: 'Saltar a fase',
    longBreakLabel: 'Descanso largo',
    sessionDone: 'Sesión completada — descanso corto',
    longBreakMsg: 'sesiones completadas — ¡descanso largo!',
    breakOver: 'Descanso terminado — a concentrarse',
    readyBreak: 'Listo para descansar',
    readyFocus: 'Listo para concentrarse',
    quote: 'Cita',
    coffeeBtn: 'Invítame un café',
  },
  de: {
    newQuote: 'Neues Zitat',
    newScene: 'Neue Szene',
    focus: 'Fokus',
    break: 'Pause',
    timerSettings: 'Timer-Einstellungen',
    focusMin: 'Fokus (Min)',
    breakMin: 'Pause (Min)',
    longBreak: 'Lange Pause',
    sessions: 'Sitzungen',
    jumpToPhase: 'Zur Phase springen',
    longBreakLabel: 'Lange Pause',
    sessionDone: 'Sitzung beendet — kurze Pause',
    longBreakMsg: 'Sitzungen beendet — lange Pause!',
    breakOver: 'Pause vorbei — Zeit zum Fokussieren',
    readyBreak: 'Bereit zur Pause',
    readyFocus: 'Bereit zum Fokussieren',
    quote: 'Zitat',
    coffeeBtn: 'Kauf mir einen Kaffee',
  },
  it: {
    newQuote: 'Nuova citazione',
    newScene: 'Nuova scena',
    focus: 'Concentrazione',
    break: 'Pausa',
    timerSettings: 'Impostazioni timer',
    focusMin: 'Concentrazione (min)',
    breakMin: 'Pausa (min)',
    longBreak: 'Pausa lunga',
    sessions: 'Sessioni',
    jumpToPhase: 'Vai alla fase',
    longBreakLabel: 'Pausa lunga',
    sessionDone: 'Sessione completata — pausa breve',
    longBreakMsg: 'sessioni completate — pausa lunga!',
    breakOver: 'Pausa finita — torniamo a concentrarci',
    readyBreak: 'Pronto per la pausa',
    readyFocus: 'Pronto per concentrarsi',
    quote: 'Citazione',
    coffeeBtn: 'Offrimi un caffè',
  },
  pt: {
    newQuote: 'Nova citação',
    newScene: 'Nova cena',
    focus: 'Foco',
    break: 'Pausa',
    timerSettings: 'Configurações do temporizador',
    focusMin: 'Foco (min)',
    breakMin: 'Pausa (min)',
    longBreak: 'Pausa longa',
    sessions: 'Sessões',
    jumpToPhase: 'Ir para fase',
    longBreakLabel: 'Pausa longa',
    sessionDone: 'Sessão concluída — pausa curta',
    longBreakMsg: 'sessões concluídas — pausa longa!',
    breakOver: 'Pausa terminada — vamos focar',
    readyBreak: 'Pronto para pausar',
    readyFocus: 'Pronto para focar',
    quote: 'Citação',
    coffeeBtn: 'Pague-me um café',
  },
  nl: {
    newQuote: 'Nieuw citaat',
    newScene: 'Nieuwe scène',
    focus: 'Focus',
    break: 'Pauze',
    timerSettings: 'Timerinstellingen',
    focusMin: 'Focus (min)',
    breakMin: 'Pauze (min)',
    longBreak: 'Lange pauze',
    sessions: 'Sessies',
    jumpToPhase: 'Ga naar fase',
    longBreakLabel: 'Lange pauze',
    sessionDone: 'Sessie klaar — korte pauze',
    longBreakMsg: 'sessies klaar — lange pauze!',
    breakOver: 'Pauze voorbij — tijd om te focussen',
    readyBreak: 'Klaar voor pauze',
    readyFocus: 'Klaar om te focussen',
    quote: 'Citaat',
    coffeeBtn: 'Koop een koffie voor mij',
  },
  ru: {
    newQuote: 'Новая цитата',
    newScene: 'Новая сцена',
    focus: 'Фокус',
    break: 'Перерыв',
    timerSettings: 'Настройки таймера',
    focusMin: 'Фокус (мин)',
    breakMin: 'Перерыв (мин)',
    longBreak: 'Длинный перерыв',
    sessions: 'Сессии',
    jumpToPhase: 'Перейти к фазе',
    longBreakLabel: 'Длинный перерыв',
    sessionDone: 'Сессия завершена — короткий перерыв',
    longBreakMsg: 'сессий завершено — длинный перерыв!',
    breakOver: 'Перерыв окончен — время фокусироваться',
    readyBreak: 'Готов к перерыву',
    readyFocus: 'Готов фокусироваться',
    quote: 'Цитата',
    coffeeBtn: 'Угостите кофе',
  },
  ja: {
    newQuote: '新しい名言',
    newScene: '新しい場面',
    focus: '集中',
    break: '休憩',
    timerSettings: 'タイマー設定',
    focusMin: '集中（分）',
    breakMin: '休憩（分）',
    longBreak: '長い休憩',
    sessions: 'セッション',
    jumpToPhase: 'フェーズへ移動',
    longBreakLabel: '長い休憩',
    sessionDone: 'セッション終了 — 短い休憩',
    longBreakMsg: 'セッション完了 — 長い休憩！',
    breakOver: '休憩終了 — 集中しましょう',
    readyBreak: '休憩の準備完了',
    readyFocus: '集中の準備完了',
    quote: '名言',
    coffeeBtn: 'コーヒーをおごる',
  },
  ko: {
    newQuote: '새 인용구',
    newScene: '새 장면',
    focus: '집중',
    break: '휴식',
    timerSettings: '타이머 설정',
    focusMin: '집중 (분)',
    breakMin: '휴식 (분)',
    longBreak: '긴 휴식',
    sessions: '세션',
    jumpToPhase: '단계로 이동',
    longBreakLabel: '긴 휴식',
    sessionDone: '세션 완료 — 짧은 휴식',
    longBreakMsg: '세션 완료 — 긴 휴식!',
    breakOver: '휴식 종료 — 집중할 시간',
    readyBreak: '휴식 준비 완료',
    readyFocus: '집중 준비 완료',
    quote: '인용',
    coffeeBtn: '커피 한 잔 사주기',
  },
  zh: {
    newQuote: '新名言',
    newScene: '新场景',
    focus: '专注',
    break: '休息',
    timerSettings: '计时器设置',
    focusMin: '专注（分钟）',
    breakMin: '休息（分钟）',
    longBreak: '长休息',
    sessions: '会话',
    jumpToPhase: '跳至阶段',
    longBreakLabel: '长休息',
    sessionDone: '专注结束 — 短暂休息',
    longBreakMsg: '次专注完成 — 长休息！',
    breakOver: '休息结束 — 开始专注',
    readyBreak: '准备休息',
    readyFocus: '准备专注',
    quote: '名言',
    coffeeBtn: '请我喝杯咖啡',
  },
  ar: {
    newQuote: 'اقتباس جديد',
    newScene: 'مشهد جديد',
    focus: 'تركيز',
    break: 'استراحة',
    timerSettings: 'إعدادات المؤقت',
    focusMin: 'تركيز (دقيقة)',
    breakMin: 'استراحة (دقيقة)',
    longBreak: 'استراحة طويلة',
    sessions: 'جلسات',
    jumpToPhase: 'الانتقال إلى المرحلة',
    longBreakLabel: 'استراحة طويلة',
    sessionDone: 'انتهت الجلسة — استراحة قصيرة',
    longBreakMsg: 'جلسات منجزة — استراحة طويلة!',
    breakOver: 'انتهت الاستراحة — لنركز',
    readyBreak: 'جاهز للاستراحة',
    readyFocus: 'جاهز للتركيز',
    quote: 'اقتباس',
    coffeeBtn: 'اشترِ لي قهوة',
  },
  hi: {
    newQuote: 'नया उद्धरण',
    newScene: 'नया दृश्य',
    focus: 'फ़ोकस',
    break: 'विराम',
    timerSettings: 'टाइमर सेटिंग',
    focusMin: 'फ़ोकस (मिनट)',
    breakMin: 'विराम (मिनट)',
    longBreak: 'लंबा विराम',
    sessions: 'सत्र',
    jumpToPhase: 'चरण पर जाएं',
    longBreakLabel: 'लंबा विराम',
    sessionDone: 'सत्र समाप्त — छोटा विराम',
    longBreakMsg: 'सत्र पूर्ण — लंबा विराम!',
    breakOver: 'विराम समाप्त — ध्यान केंद्रित करें',
    readyBreak: 'विराम के लिए तैयार',
    readyFocus: 'फ़ोकस के लिए तैयार',
    quote: 'उद्धरण',
    coffeeBtn: 'मुझे कॉफ़ी दिलाएं',
  },
  tr: {
    newQuote: 'Yeni alıntı',
    newScene: 'Yeni sahne',
    focus: 'Odak',
    break: 'Mola',
    timerSettings: 'Zamanlayıcı ayarları',
    focusMin: 'Odak (dk)',
    breakMin: 'Mola (dk)',
    longBreak: 'Uzun mola',
    sessions: 'Oturumlar',
    jumpToPhase: 'Aşamaya geç',
    longBreakLabel: 'Uzun mola',
    sessionDone: 'Oturum bitti — kısa mola',
    longBreakMsg: 'oturum tamamlandı — uzun mola!',
    breakOver: 'Mola bitti — odaklanma zamanı',
    readyBreak: 'Molaya hazır',
    readyFocus: 'Odaklanmaya hazır',
    quote: 'Alıntı',
    coffeeBtn: 'Bana bir kahve ısmarla',
  },
  pl: {
    newQuote: 'Nowy cytat',
    newScene: 'Nowa scena',
    focus: 'Skupienie',
    break: 'Przerwa',
    timerSettings: 'Ustawienia timera',
    focusMin: 'Skupienie (min)',
    breakMin: 'Przerwa (min)',
    longBreak: 'Długa przerwa',
    sessions: 'Sesje',
    jumpToPhase: 'Przejdź do fazy',
    longBreakLabel: 'Długa przerwa',
    sessionDone: 'Sesja zakończona — krótka przerwa',
    longBreakMsg: 'sesji ukończonych — długa przerwa!',
    breakOver: 'Przerwa minęła — czas na skupienie',
    readyBreak: 'Gotowy na przerwę',
    readyFocus: 'Gotowy do skupienia',
    quote: 'Cytat',
    coffeeBtn: 'Postaw mi kawę',
  },
  uk: {
    newQuote: 'Нова цитата',
    newScene: 'Нова сцена',
    focus: 'Фокус',
    break: 'Перерва',
    timerSettings: 'Налаштування таймера',
    focusMin: 'Фокус (хв)',
    breakMin: 'Перерва (хв)',
    longBreak: 'Довга перерва',
    sessions: 'Сесії',
    jumpToPhase: 'Перейти до фази',
    longBreakLabel: 'Довга перерва',
    sessionDone: 'Сесія завершена — коротка перерва',
    longBreakMsg: 'сесій завершено — довга перерва!',
    breakOver: 'Перерва закінчилась — час фокусуватись',
    readyBreak: 'Готовий до перерви',
    readyFocus: 'Готовий до фокусу',
    quote: 'Цитата',
    coffeeBtn: 'Пригостіть кавою',
  },
  sv: {
    newQuote: 'Nytt citat',
    newScene: 'Ny scen',
    focus: 'Fokus',
    break: 'Rast',
    timerSettings: 'Timerinställningar',
    focusMin: 'Fokus (min)',
    breakMin: 'Rast (min)',
    longBreak: 'Lång rast',
    sessions: 'Sessioner',
    jumpToPhase: 'Gå till fas',
    longBreakLabel: 'Lång rast',
    sessionDone: 'Session klar — kort rast',
    longBreakMsg: 'sessioner klara — lång rast!',
    breakOver: 'Rasten är slut — dags att fokusera',
    readyBreak: 'Redo för rast',
    readyFocus: 'Redo att fokusera',
    quote: 'Citat',
    coffeeBtn: 'Bjud mig på kaffe',
  },
  da: {
    newQuote: 'Nyt citat',
    newScene: 'Ny scene',
    focus: 'Fokus',
    break: 'Pause',
    timerSettings: 'Timerindstillinger',
    focusMin: 'Fokus (min)',
    breakMin: 'Pause (min)',
    longBreak: 'Lang pause',
    sessions: 'Sessioner',
    jumpToPhase: 'Gå til fase',
    longBreakLabel: 'Lang pause',
    sessionDone: 'Session færdig — kort pause',
    longBreakMsg: 'sessioner færdige — lang pause!',
    breakOver: 'Pausen er slut — tid til fokus',
    readyBreak: 'Klar til pause',
    readyFocus: 'Klar til fokus',
    quote: 'Citat',
    coffeeBtn: 'Køb mig en kaffe',
  },
  no: {
    newQuote: 'Nytt sitat',
    newScene: 'Ny scene',
    focus: 'Fokus',
    break: 'Pause',
    timerSettings: 'Timerinnstillinger',
    focusMin: 'Fokus (min)',
    breakMin: 'Pause (min)',
    longBreak: 'Lang pause',
    sessions: 'Sesjoner',
    jumpToPhase: 'Gå til fase',
    longBreakLabel: 'Lang pause',
    sessionDone: 'Sesjon fullført — kort pause',
    longBreakMsg: 'sesjoner fullført — lang pause!',
    breakOver: 'Pause over — tid for fokus',
    readyBreak: 'Klar til pause',
    readyFocus: 'Klar til fokus',
    quote: 'Sitat',
    coffeeBtn: 'Kjøp meg en kaffe',
  },
  fi: {
    newQuote: 'Uusi lainaus',
    newScene: 'Uusi näkymä',
    focus: 'Keskittyminen',
    break: 'Tauko',
    timerSettings: 'Ajastimen asetukset',
    focusMin: 'Keskittyminen (min)',
    breakMin: 'Tauko (min)',
    longBreak: 'Pitkä tauko',
    sessions: 'Istunnot',
    jumpToPhase: 'Siirry vaiheeseen',
    longBreakLabel: 'Pitkä tauko',
    sessionDone: 'Istunto valmis — lyhyt tauko',
    longBreakMsg: 'istuntoa valmis — pitkä tauko!',
    breakOver: 'Tauko ohi — aika keskittyä',
    readyBreak: 'Valmis taukoon',
    readyFocus: 'Valmis keskittymään',
    quote: 'Lainaus',
    coffeeBtn: 'Osta minulle kahvi',
  },
  el: {
    newQuote: 'Νέο απόφθεγμα',
    newScene: 'Νέα σκηνή',
    focus: 'Εστίαση',
    break: 'Διάλειμμα',
    timerSettings: 'Ρυθμίσεις χρονόμετρου',
    focusMin: 'Εστίαση (λεπτ)',
    breakMin: 'Διάλειμμα (λεπτ)',
    longBreak: 'Μεγάλο διάλειμμα',
    sessions: 'Συνεδρίες',
    jumpToPhase: 'Μετάβαση σε φάση',
    longBreakLabel: 'Μεγάλο διάλειμμα',
    sessionDone: 'Συνεδρία τελείωσε — σύντομο διάλειμμα',
    longBreakMsg: 'συνεδρίες τελείωσαν — μεγάλο διάλειμμα!',
    breakOver: 'Το διάλειμμα τελείωσε — ώρα για εστίαση',
    readyBreak: 'Έτοιμος για διάλειμμα',
    readyFocus: 'Έτοιμος για εστίαση',
    quote: 'Απόσπασμα',
    coffeeBtn: 'Κέρασέ μου έναν καφέ',
  },
  he: {
    newQuote: 'ציטוט חדש',
    newScene: 'סצנה חדשה',
    focus: 'מיקוד',
    break: 'הפסקה',
    timerSettings: 'הגדרות טיימר',
    focusMin: 'מיקוד (דק׳)',
    breakMin: 'הפסקה (דק׳)',
    longBreak: 'הפסקה ארוכה',
    sessions: 'מפגשים',
    jumpToPhase: 'עבור לשלב',
    longBreakLabel: 'הפסקה ארוכה',
    sessionDone: 'מפגש הסתיים — הפסקה קצרה',
    longBreakMsg: 'מפגשים הסתיימו — הפסקה ארוכה!',
    breakOver: 'ההפסקה הסתיימה — בואו נתרכז',
    readyBreak: 'מוכן להפסקה',
    readyFocus: 'מוכן להתרכז',
    quote: 'ציטוט',
    coffeeBtn: 'קנו לי קפה',
  },
  th: {
    newQuote: 'คำคมใหม่',
    newScene: 'ฉากใหม่',
    focus: 'โฟกัส',
    break: 'พัก',
    timerSettings: 'ตั้งค่าตัวจับเวลา',
    focusMin: 'โฟกัส (นาที)',
    breakMin: 'พัก (นาที)',
    longBreak: 'พักยาว',
    sessions: 'รอบ',
    jumpToPhase: 'ไปยังขั้นตอน',
    longBreakLabel: 'พักยาว',
    sessionDone: 'รอบเสร็จสิ้น — พักสั้น',
    longBreakMsg: 'รอบเสร็จสิ้น — พักยาว!',
    breakOver: 'หมดเวลาพัก — มาโฟกัสกัน',
    readyBreak: 'พร้อมพัก',
    readyFocus: 'พร้อมโฟกัส',
    quote: 'คำคม',
    coffeeBtn: 'เลี้ยงกาแฟหน่อย',
  },
  vi: {
    newQuote: 'Câu trích dẫn mới',
    newScene: 'Cảnh mới',
    focus: 'Tập trung',
    break: 'Nghỉ',
    timerSettings: 'Cài đặt hẹn giờ',
    focusMin: 'Tập trung (phút)',
    breakMin: 'Nghỉ (phút)',
    longBreak: 'Nghỉ dài',
    sessions: 'Phiên',
    jumpToPhase: 'Chuyển đến giai đoạn',
    longBreakLabel: 'Nghỉ dài',
    sessionDone: 'Phiên xong — nghỉ ngắn',
    longBreakMsg: 'phiên hoàn thành — nghỉ dài!',
    breakOver: 'Hết giờ nghỉ — hãy tập trung',
    readyBreak: 'Sẵn sàng nghỉ',
    readyFocus: 'Sẵn sàng tập trung',
    quote: 'Trích dẫn',
    coffeeBtn: 'Mua cho tôi ly cà phê',
  },
  id: {
    newQuote: 'Kutipan baru',
    newScene: 'Latar baru',
    focus: 'Fokus',
    break: 'Istirahat',
    timerSettings: 'Pengaturan timer',
    focusMin: 'Fokus (menit)',
    breakMin: 'Istirahat (menit)',
    longBreak: 'Istirahat panjang',
    sessions: 'Sesi',
    jumpToPhase: 'Pindah ke fase',
    longBreakLabel: 'Istirahat panjang',
    sessionDone: 'Sesi selesai — istirahat pendek',
    longBreakMsg: 'sesi selesai — istirahat panjang!',
    breakOver: 'Istirahat selesai — saatnya fokus',
    readyBreak: 'Siap istirahat',
    readyFocus: 'Siap fokus',
    quote: 'Kutipan',
    coffeeBtn: 'Belikan saya kopi',
  },
  ms: {
    newQuote: 'Petikan baharu',
    newScene: 'Adegan baharu',
    focus: 'Fokus',
    break: 'Rehat',
    timerSettings: 'Tetapan pemasa',
    focusMin: 'Fokus (min)',
    breakMin: 'Rehat (min)',
    longBreak: 'Rehat panjang',
    sessions: 'Sesi',
    jumpToPhase: 'Pergi ke fasa',
    longBreakLabel: 'Rehat panjang',
    sessionDone: 'Sesi selesai — rehat pendek',
    longBreakMsg: 'sesi selesai — rehat panjang!',
    breakOver: 'Rehat tamat — masa untuk fokus',
    readyBreak: 'Bersedia untuk rehat',
    readyFocus: 'Bersedia untuk fokus',
    quote: 'Petikan',
    coffeeBtn: 'Belanja saya kopi',
  },
  ro: {
    newQuote: 'Citat nou',
    newScene: 'Scenă nouă',
    focus: 'Concentrare',
    break: 'Pauză',
    timerSettings: 'Setări timer',
    focusMin: 'Concentrare (min)',
    breakMin: 'Pauză (min)',
    longBreak: 'Pauză lungă',
    sessions: 'Sesiuni',
    jumpToPhase: 'Sari la fază',
    longBreakLabel: 'Pauză lungă',
    sessionDone: 'Sesiune terminată — pauză scurtă',
    longBreakMsg: 'sesiuni terminate — pauză lungă!',
    breakOver: 'Pauza s-a terminat — să ne concentrăm',
    readyBreak: 'Gata de pauză',
    readyFocus: 'Gata de concentrare',
    quote: 'Citat',
    coffeeBtn: 'Cumpără-mi o cafea',
  },
  cs: {
    newQuote: 'Nový citát',
    newScene: 'Nová scéna',
    focus: 'Soustředění',
    break: 'Přestávka',
    timerSettings: 'Nastavení časovače',
    focusMin: 'Soustředění (min)',
    breakMin: 'Přestávka (min)',
    longBreak: 'Dlouhá přestávka',
    sessions: 'Relace',
    jumpToPhase: 'Přejít na fázi',
    longBreakLabel: 'Dlouhá přestávka',
    sessionDone: 'Relace skončila — krátká přestávka',
    longBreakMsg: 'relací hotovo — dlouhá přestávka!',
    breakOver: 'Přestávka skončila — čas soustředit se',
    readyBreak: 'Připraven na přestávku',
    readyFocus: 'Připraven se soustředit',
    quote: 'Citát',
    coffeeBtn: 'Kupte mi kávu',
  },
  hu: {
    newQuote: 'Új idézet',
    newScene: 'Új jelenet',
    focus: 'Fókusz',
    break: 'Szünet',
    timerSettings: 'Időzítő beállítások',
    focusMin: 'Fókusz (perc)',
    breakMin: 'Szünet (perc)',
    longBreak: 'Hosszú szünet',
    sessions: 'Munkaszakaszok',
    jumpToPhase: 'Ugrás fázishoz',
    longBreakLabel: 'Hosszú szünet',
    sessionDone: 'Munkaszakasz kész — rövid szünet',
    longBreakMsg: 'munkaszakasz kész — hosszú szünet!',
    breakOver: 'Szünet vége — ideje fókuszálni',
    readyBreak: 'Kész a szünetre',
    readyFocus: 'Kész a fókuszra',
    quote: 'Idézet',
    coffeeBtn: 'Vegyél nekem egy kávét',
  },
  bg: {
    newQuote: 'Нов цитат',
    newScene: 'Нова сцена',
    focus: 'Фокус',
    break: 'Почивка',
    timerSettings: 'Настройки на таймера',
    focusMin: 'Фокус (мин)',
    breakMin: 'Почивка (мин)',
    longBreak: 'Дълга почивка',
    sessions: 'Сесии',
    jumpToPhase: 'Преминаване към фаза',
    longBreakLabel: 'Дълга почивка',
    sessionDone: 'Сесията приключи — кратка почивка',
    longBreakMsg: 'сесии приключени — дълга почивка!',
    breakOver: 'Почивката приключи — време за фокус',
    readyBreak: 'Готов за почивка',
    readyFocus: 'Готов за фокус',
    quote: 'Цитат',
    coffeeBtn: 'Купете ми кафе',
  },
};

/**
 * QUOTE TRANSLATION SYSTEM — DESIGN NOTES
 *
 * - Both the quote *text* and the author attribution line are translated on demand
 *   via public free APIs (MyMemory primary, Google web fallback, LibreTranslate).
 *   This provides full immersion, including for story titles like
 *   "Algonquin Story — Wisakedjak and the Sun Snare".
 * - Translation always starts from the clean English source (authorEn || author
 *   for the attribution, original text for the body) + localStorage caching.
 * - A strong defensive cleanTranslation() is applied to *every* result from the
 *   APIs before use or caching. It strips <g id="..."> tags and any other leaked
 *   markup that some providers (especially the Google endpoint) occasionally
 *   return.
 * - Curated translations live in quotes-i18n.js, keyed by stable quote id
 *   (not quote text) so edits to wording do not break lookups.
 * - On startup the entire QUOTES dataset has its author/authorEn fields
 *   sanitized so all display paths see clean base data.
 * - UI chrome (buttons, labels, settings) uses hand-curated strings in
 *   UI_STRINGS — only the quote body + author line go through MT.
 *
 * The result is smooth, consistent, and free of garbage across languages while
 * staying 100% client-side with no external dependencies or build step.
 */
let currentLang = 'en';
let translationCache = {};

function trimTranslationCache() {
  const keys = Object.keys(translationCache);
  if (keys.length <= TRANSLATION_CACHE_MAX) return;
  keys.slice(0, keys.length - TRANSLATION_CACHE_MAX).forEach((k) => {
    delete translationCache[k];
  });
}

function loadTranslationCache() {
  try {
    const raw = localStorage.getItem(TRANSLATION_CACHE_KEY)
      || localStorage.getItem(TRANSLATION_CACHE_KEY_LEGACY);
    if (raw) translationCache = JSON.parse(raw);
    trimTranslationCache();
  } catch(e) { translationCache = {}; }
}

function saveTranslationCache() {
  try {
    trimTranslationCache();
    localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(translationCache));
  } catch(e) {}
}

function getCacheKey(text, targetLang) {
  return `en|${targetLang}|${text}`;
}

function getCachedTranslation(text, targetLang) {
  return translationCache[getCacheKey(text, targetLang)] || null;
}

function setCachedTranslation(text, targetLang, translated) {
  translationCache[getCacheKey(text, targetLang)] = translated;
  trimTranslationCache();
}

/**
 * Translate text using open-source APIs.
 * Provider 1: MyMemory (free, no key, ~1 000 chars/day anonymous)
 * Provider 2: Google Translate web endpoint (unofficial, no key, high quota)
 * Provider 3: LibreTranslate public instance (FOSS fallback)
 */

// Some providers use different codes for the same language.
function _gtLang(lang) {
  const map = { zh: 'zh-CN', he: 'iw' };
  return map[lang] || lang;
}

/**
 * Sanitize text coming back from translation APIs.
 * Some providers (especially the Google web endpoint) occasionally leak
 * alignment/glossary markup such as <g id="734">Discours</g>.
 * We strip these so they never appear in the UI for quote text or authors.
 */
function cleanTranslation(str) {
  if (typeof str !== 'string' || !str) return str;
  // Remove Google-style <g id="...">...</g> tags (and any variant)
  let out = str.replace(/<g[^>]*>([\s\S]*?)<\/g>/gi, '$1');
  // Remove any other stray HTML/XML tags that might leak
  out = out.replace(/<[^>]+>/g, '');
  // Decode HTML entities from translation APIs (&apos;, &#39;, etc.)
  out = out
    .replace(/&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
  // Strip leaked guillemets / quote marks (UI already shows a decorative mark)
  out = out.replace(/^[«»‹›"'`]+|[«»‹›"'`]+$/g, '');
  out = out.replace(/[»›]{2,}/g, '');
  out = out.replace(/\s+([.,;:!?])/g, '$1');
  out = out.replace(/\s+/g, ' ').trim();
  return out;
}

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  if (!text || !text.trim()) return text;

  const cached = getCachedTranslation(text, targetLang);
  if (cached) return cached;

  const encoded = encodeURIComponent(text);

  // Provider 1: MyMemory
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|${targetLang}`;
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json();
      if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
        const translated = cleanTranslation(data.responseData.translatedText);
        // MyMemory returns uppercase when it can't translate — skip those
        if (translated !== text.toUpperCase()) {
          setCachedTranslation(text, targetLang, translated);
          return translated;
        }
      }
    }
  } catch(e) {}

  // Provider 2: Google Translate (unofficial web endpoint — supports all languages,
  // no API key required, high quota)
  try {
    const tl = _gtLang(targetLang);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tl}&dt=t&q=${encoded}`;
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json();
      // Response is nested arrays: [[["translated","original",...],...],...]
      const raw = data?.[0]?.map(s => s?.[0]).filter(Boolean).join('');
      const translated = cleanTranslation(raw);
      if (translated) {
        setCachedTranslation(text, targetLang, translated);
        return translated;
      }
    }
  } catch(e) {}

  // Provider 3: LibreTranslate public instance
  try {
    const resp = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: text, source: 'en', target: targetLang, format: 'text' }),
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.translatedText) {
        const translated = cleanTranslation(data.translatedText);
        setCachedTranslation(text, targetLang, translated);
        return translated;
      }
    }
  } catch(e) {}

  return text;
}

/**
 * Batch translate an array of strings. Returns array of translated strings.
 * Uses concurrency limit to avoid hammering the API.
 */
async function batchTranslate(texts, targetLang) {
  if (targetLang === 'en') return [...texts];

  const results = new Array(texts.length);
  const uncached = [];

  // Separate cached from uncached
  for (let i = 0; i < texts.length; i++) {
    const cached = getCachedTranslation(texts[i], targetLang);
    if (cached) {
      results[i] = cached;
    } else {
      uncached.push(i);
    }
  }

  // Translate uncached items with concurrency limit of 3
  const CONCURRENCY = 3;
  for (let start = 0; start < uncached.length; start += CONCURRENCY) {
    const batch = uncached.slice(start, start + CONCURRENCY);
    const promises = batch.map(idx => translateText(texts[idx], targetLang).then(t => { results[idx] = t; }));
    await Promise.all(promises);
  }

  saveTranslationCache();
  return results;
}

async function translateCurrentQuote() {
  if (currentLang === 'en') return;

  const textEl = document.getElementById('quote-text');
  const authorEl = document.getElementById('quote-author');
  const quote = QUOTES[currentQuoteIdx];
  if (!quote) return;

  // Fade out immediately — don't show native-script text while waiting
  textEl.style.opacity = '0';
  authorEl.style.opacity = '0';

  // We translate *both* the quote body and the author attribution line.
  // This is desired for full immersion, especially when the attribution is a
  // story title (e.g. "Algonquin Story — Wisakedjak and the Sun Snare" →
  // French equivalent). We start from the clean English source data.
  const localized = await resolveLocalizedQuote(quote, currentLang);

  // Only update if still showing the same quote (stale calls are ignored).
  if (currentQuoteIdx === QUOTES.indexOf(quote)) {
    textEl.textContent = localized.text;
    authorEl.textContent = localized.author;

    // Double rAF ensures browser renders opacity:0 before starting fade-in transition
    requestAnimationFrame(() => requestAnimationFrame(() => {
      textEl.style.opacity = '1';
      authorEl.style.opacity = '1';
      invalidateQuoteLayout();
    }));
  }
}

async function translateUIStrings(lang) {
  if (lang === 'en') {
    applyUIStrings(UI_STRINGS.en);
    return;
  }

  // Check if we already have cached UI strings for this language
  if (UI_STRINGS[lang]) {
    applyUIStrings(UI_STRINGS[lang]);
    return;
  }

  // Translate UI strings
  const keys = Object.keys(UI_STRINGS.en);
  const values = keys.map(k => UI_STRINGS.en[k]);
  const translated = await batchTranslate(values, lang);

  const langStrings = {};
  keys.forEach((k, i) => { langStrings[k] = translated[i]; });
  UI_STRINGS[lang] = langStrings;

  applyUIStrings(langStrings);
}

function applyUIStrings(strings) {
  document.getElementById('btn-new').textContent = strings.newQuote;
  document.getElementById('btn-bg').textContent = strings.newScene;
  const solitaireLabel = document.getElementById('solitaire-btn-label');
  const radarLabel = document.getElementById('radar-btn-label');
  const solitaireBtn = document.getElementById('solitaire-btn');
  const radarBtn = document.getElementById('radar-btn');
  if (solitaireLabel) solitaireLabel.textContent = strings.solitaireBtn || 'Solitaire';
  if (radarLabel) radarLabel.textContent = strings.radarBtn || 'Le Radar';
  if (solitaireBtn) solitaireBtn.setAttribute('aria-label', strings.solitaireBtn || 'Solitaire');
  if (radarBtn) radarBtn.setAttribute('aria-label', strings.radarBtn || 'Le Radar');
  document.getElementById('coffee-btn-label').textContent = strings.coffeeBtn || 'Buy me a coffee';
  const homeReloadBtn = document.getElementById('home-reload-btn');
  if (homeReloadBtn) homeReloadBtn.setAttribute('aria-label', strings.homeReload || 'Reload page');

  // Settings panel text (normal widget)
  const settingsPanel = document.getElementById('pomo-settings-panel');
  const h4s = settingsPanel.querySelectorAll('h4');
  if (h4s[0]) h4s[0].textContent = strings.timerSettings;
  if (h4s[1]) h4s[1].textContent = strings.jumpToPhase;

  const labels = settingsPanel.querySelectorAll('.setting-row label');
  if (labels[0]) labels[0].textContent = strings.focusMin;
  if (labels[1]) labels[1].textContent = strings.breakMin;
  if (labels[2]) labels[2].textContent = strings.longBreak;
  if (labels[3]) labels[3].textContent = strings.sessions;

  document.getElementById('chip-focus').textContent = strings.focus;
  document.getElementById('chip-break').textContent = strings.break;
  document.getElementById('chip-long').textContent = strings.longBreakLabel;

  // Focus Deck scene bar
  const sceneTimerLabel = document.getElementById('scene-label-timer');
  const sceneQuoteLabel = document.getElementById('scene-label-quote');
  if (sceneTimerLabel) sceneTimerLabel.textContent = strings.focus;
  if (sceneQuoteLabel) sceneQuoteLabel.textContent = strings.quote;

  const fallback = UI_STRINGS.en;
  const pomoMinBtn = document.getElementById('pomo-minimize-btn');
  const quoteMinBtn = document.getElementById('quote-minimize-btn');
  const pomoRestoreBtn = document.getElementById('pomo-restore-btn');
  const quoteRestoreBtn = document.getElementById('quote-restore-btn');
  if (pomoMinBtn) pomoMinBtn.setAttribute('aria-label', strings.minimizePomo || fallback.minimizePomo);
  if (quoteMinBtn) quoteMinBtn.setAttribute('aria-label', strings.minimizeQuote || fallback.minimizeQuote);
  if (pomoRestoreBtn) {
    pomoRestoreBtn.setAttribute('aria-label', strings.restorePomo || fallback.restorePomo);
    const lbl = document.getElementById('pomo-restore-label');
    if (lbl) lbl.textContent = strings.pomodoro || 'Pomodoro';
  }
  if (quoteRestoreBtn) {
    quoteRestoreBtn.setAttribute('aria-label', strings.restoreQuote || fallback.restoreQuote);
    const lbl = document.getElementById('quote-restore-label');
    if (lbl) lbl.textContent = strings.quote;
  }
}

// Patch PomoUI / onSegmentComplete for translated labels and toasts
function getTranslatedPomoStrings() {
  return UI_STRINGS[currentLang] || UI_STRINGS.en;
}

(function patchPomoUI() {
  const origFn = PomoUI;
  window.PomoUI = function() {
    // Capture the render key before calling origFn so we know whether it
    // actually updated the DOM (i.e. the guard inside origFn didn't short-circuit).
    const prevKey = _lastPomoRenderKey;
    origFn();

    // origFn returned early (guard: nothing changed) — skip translated updates too.
    if (_lastPomoRenderKey === prevKey) return;

    const s = getTranslatedPomoStrings();
    const label = document.getElementById('pomo-label');
    const breakLabel = pomo.isLongBreak ? (s.longBreakLabel || s.break) : s.break;
    label.textContent = pomo.isBreak ? breakLabel : s.focus;

    const readyLabel = document.getElementById('pomo-phase-ready');
    if (pomo.phaseJustCompleted && !pomo.isRunning && readyLabel) {
      readyLabel.textContent = pomo.isBreak ? s.readyBreak : s.readyFocus;
    }

    // Translate fullpage overlay labels
    const fpLabel = document.getElementById('pomo-fp-label');
    if (fpLabel) fpLabel.textContent = pomo.isBreak ? breakLabel : s.focus;
    const fpReady = document.getElementById('pomo-fp-phase-ready');
    if (pomo.phaseJustCompleted && !pomo.isRunning && fpReady) {
      fpReady.textContent = pomo.isBreak ? s.readyBreak : s.readyFocus;
    }

    // Translate tab title — preserve emoji prefix and structure
    const stageEmoji = pomo.isBreak ? (pomo.isLongBreak ? '🌿' : '☕') : '🎯';
    const translatedStage = pomo.isBreak ? breakLabel : s.focus;
    const pausedMark = !pomo.isRunning && (pomo.pausedRemaining != null || pomo.startedAt != null) ? '⏸ ' : '';
    const minStr = formatMinutes(getRemaining());
    document.title = `${pausedMark}${stageEmoji} ${translatedStage} · ${minStr}m · Ataraxia`;
  };
  // Reassign for the tick loop
  PomoUI = window.PomoUI;
})();

// Patch onSegmentComplete for translated toasts
const _origOnSegmentComplete = onSegmentComplete;
window.onSegmentComplete = function() {
  _origOnSegmentComplete();
  // Translated completion toast (pomo.js no longer shows English toast)
  const s = getTranslatedPomoStrings();
  if (pomo.isBreak) {
    // Just flipped from focus → break
    const msg = pomo.isLongBreak
      ? `${pomo.completedSessions} ${s.longBreakMsg}`
      : s.sessionDone;
    showToast(msg);
  } else {
    // Just flipped from break → focus
    showToast(s.breakOver);
  }
};
onSegmentComplete = window.onSegmentComplete;

function setLanguageStatus(msg) {
  const el = document.getElementById('lang-status');
  if (msg) {
    el.textContent = msg;
    el.classList.add('visible');
  } else {
    el.classList.remove('visible');
  }
}

async function switchLanguage(langCode) {
  currentLang = langCode;
  localStorage.setItem(LANG_PREF_KEY, langCode);

  const langData = SUPPORTED_LANGS.find(l => l.code === langCode);
  const langLabel = langData ? langData.native : langCode;
  document.getElementById('lang-label').textContent = langLabel;
  const langBtn = document.getElementById('lang-btn');
  if (langBtn) langBtn.setAttribute('aria-label', `Language: ${langLabel}`);
  document.documentElement.lang = langCode;

  // Update active state in dropdown
  document.querySelectorAll('.lang-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === langCode);
  });

  // Close dropdown
  document.getElementById('lang-dropdown').classList.remove('open');

  if (langCode === 'en') {
    const quote = QUOTES[currentQuoteIdx];
    document.getElementById('quote-text').textContent = quote.text;
    const a = quote.authorEn || quote.author;
    document.getElementById('quote-author').textContent = cleanTranslation(a);
    applyUIStrings(UI_STRINGS.en);
    setLanguageStatus('');
    scheduleQuoteLayout();
    return;
  }

  // Show the plain-English author name immediately so the display is readable
  // while the quote text translation is pending.
  const currentQuote = QUOTES[currentQuoteIdx];
  if (currentQuote) {
    const a = currentQuote.authorEn || currentQuote.author;
    document.getElementById('quote-author').textContent = cleanTranslation(a);
  }

  setLanguageStatus('Translating…');

  try {
    await Promise.all([
      translateCurrentQuote(),
      translateUIStrings(langCode),
    ]);
  } catch(e) {
    // Silently continue — partial translation is fine
  }

  setLanguageStatus('');
  scheduleQuoteLayout();
}

function buildLangDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  dropdown.innerHTML = SUPPORTED_LANGS.map(lang =>
    `<button class="lang-option${lang.code === currentLang ? ' active' : ''}" data-lang="${lang.code}">${lang.native}</button>`
  ).join('');

  dropdown.addEventListener('click', (e) => {
    const btn = e.target.closest('.lang-option');
    if (btn) switchLanguage(btn.dataset.lang);
  });
}

function initTranslation() {
  loadTranslationCache();
  buildLangDropdown();

  // Toggle dropdown
  const langBtn = document.getElementById('lang-btn');
  const dropdown = document.getElementById('lang-dropdown');
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== langBtn) {
      dropdown.classList.remove('open');
    }
  });

  // Check saved preference or detect browser language
  const saved = localStorage.getItem(LANG_PREF_KEY)
    || localStorage.getItem(LANG_PREF_KEY_LEGACY);
  if (saved && saved !== 'en') {
    switchLanguage(saved);
  } else if (!saved) {
    // Auto-detect from browser
    const browserLang = (navigator.language || navigator.userLanguage || 'en').split('-')[0].toLowerCase();
    if (browserLang !== 'en' && SUPPORTED_LANGS.find(l => l.code === browserLang)) {
      switchLanguage(browserLang);
    }
  }
}
