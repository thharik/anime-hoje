# Anime Hoje — V1.5

## Translation strategy
This version intentionally does NOT include an in-site language selector.

The canonical page language is English (`<html lang="en">`). This makes browsers such as Google Chrome able to offer their own built-in page translation interface when the visitor uses another preferred language.

Examples:
- English-language Chrome: the page stays in English.
- Portuguese-language Chrome: Chrome may offer "Translate to Portuguese".
- Spanish-language Chrome: Chrome may offer "Translate to Spanish".

The browser controls whether and when that translation prompt appears. A website cannot force Chrome's native translation popup.

## Anime titles
Anime names are protected with both:
- `translate="no"`
- `class="notranslate"`

This asks translation engines such as Google Translate to keep anime titles unchanged while translating the surrounding interface and synopsis.

## Removed
- Internal language selector.
- Browser Translator API button for synopsis.
- `js/i18n.js`.

## Still included
- Internal anime pages.
- Favorites stored locally.
- Security headers.
- Automatic schedule/trending data.
