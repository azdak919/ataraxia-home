# Ataraxia — Daily Quotes & Focus Timer

A minimalist, open-source browser homepage combining stoic philosophy with a focus timer. No accounts, no tracking, no dependencies — everything runs in a single HTML file.

**Live:** https://azdak919.github.io/ataraxia-home/

---

## Features

### Stoic Quotes
- 200+ curated quotes from Marcus Aurelius, Seneca, Epictetus, Buddha, Lao Tzu, Rumi, and more
- Auto-translation into 30 languages (powered by MyMemory & LibreTranslate — no API key required)
- Press `Q` to load a new quote

### Pomodoro Timer
- Configurable work / break / long break durations
- Persistent state — survives page refresh via localStorage
- Full-page focus overlay mode
- Audio notifications with platform-specific sound generation (iOS, Android, Desktop)
- Media Session API for lock screen controls
- Screen Wake Lock to keep the display on during sessions
- Press `Space` to play / pause

### Backgrounds
- 100+ curated images from Unsplash, Pexels, and Wikimedia Commons (classical paintings)
- Dynamic Unsplash random fetch for infinite variety
- Full photo credit attribution with source links
- Press `B` for the next background

### Progressive Web App
- Installable on any device (iOS, Android, Desktop)
- Works offline
- No build step — pure HTML / CSS / JS

### Adaptive Design
- OS dark / light theme detection
- High-contrast mode support
- Landscape & portrait phone layouts
- Safe-area support for notched devices

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Q` | New random quote |
| `B` | Next background |
| `Space` | Play / pause timer |
| `Esc` | Close full-page timer |

---

## Versioning

The patch version (`v1.0.X`) is automatically incremented on every merged pull request via GitHub Actions. The version is displayed as a badge in the bottom-right corner of the app.

For minor or major bumps, use the included script:

```bash
./bump-version.sh v1.1.0
```

---

## License

[GNU General Public License v2](LICENSE) — Charles Tison
