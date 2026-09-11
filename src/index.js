const DATA_API = "https://graphql.anilist.co";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com https://www.gstatic.com; font-src 'self' https://fonts.gstatic.com https://www.gstatic.com; img-src 'self' data: https://s4.anilist.co; connect-src 'self' https://graphql.anilist.co; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; frame-src 'none'; manifest-src 'self'; worker-src 'self'; upgrade-insecure-requests"
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (s) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  }[s]));
}

function decodeBasicEntities(value = "") {
  return String(value)
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function cleanDescription(html = "") {
  return decodeBasicEntities(
    String(html || "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
  ).replace(/\n{3,}/g, "\n\n").trim() || "Synopsis unavailable.";
}

function displayTitle(media) {
  return media?.title?.romaji ||
         media?.title?.userPreferred ||
         media?.title?.native ||
         media?.title?.english ||
         "Anime";
}

function mediaFormat(value) {
  const map = {
    TV: "TV Series", TV_SHORT: "TV Short", MOVIE: "Movie",
    SPECIAL: "Special", OVA: "OVA", ONA: "ONA", MUSIC: "Music Video"
  };
  return map[value] || value || "Anime";
}

function securityHeaders(extra = {}) {
  const headers = new Headers(extra);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return headers;
}

async function fetchAnime(id) {
  const query = `
    query ($id:Int) {
      Media(id:$id, type:ANIME) {
        id
        title { userPreferred romaji english native }
        coverImage { extraLarge large }
        bannerImage
        description
        genres
        averageScore
        episodes
        duration
        status
        season
        seasonYear
        format
        nextAiringEpisode { episode airingAt timeUntilAiring }
      }
    }
  `;

  const response = await fetch(DATA_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ query, variables: { id } })
  });

  if (!response.ok) {
    throw new Error(`Catalog API returned HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message || "Catalog API error");
  }

  return payload.data?.Media;
}

function renderAnimePage(m) {
  const rawTitle = displayTitle(m);
  const title = escapeHtml(rawTitle);
  const cover = escapeHtml(m.coverImage?.extraLarge || m.coverImage?.large || "");
  const banner = escapeHtml(m.bannerImage || "");
  const synopsis = escapeHtml(cleanDescription(m.description)).replace(/\n/g, "<br>");
  const genres = (m.genres || [])
    .map((g) => `<span class="tag">${escapeHtml(g)}</span>`)
    .join("");

  const next = m.nextAiringEpisode
    ? `<div class="detail-next"><strong>Next episode: episode ${escapeHtml(m.nextAiringEpisode.episode)} in approximately ${Math.max(1, Math.ceil(m.nextAiringEpisode.timeUntilAiring / 3600))}h</strong></div>`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="description" content="${escapeHtml(cleanDescription(m.description)).slice(0, 155)}">
  <meta name="robots" content="index,follow">
  <title>${title} — Anime Hoje</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23D6301F'/%3E%3Ctext x='32' y='45' font-family='sans-serif' font-size='36' font-weight='900' fill='%23F1EBDD' text-anchor='middle'%3Eア%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <header class="ident">
    <div class="wrap identbar">
      <a class="brand notranslate" translate="no" href="/index.html" aria-label="Anime Hoje">
        <span class="brand-mark" aria-hidden="true">ア</span>
        <span class="brand-word">ANIME<br>HOJE</span>
      </a>
      <nav>
        <a href="/index.html#hoje">Today</a>
        <a href="/index.html#em-alta">Trending</a>
        <a href="/index.html#noticias">News</a>
      </nav>
      <div class="ident-right"><a class="ghost" href="/index.html">← Back</a></div>
    </div>
  </header>

  <main class="wrap detail-wrap" data-anime-id="${m.id}">
    <article class="detail-card">
      ${banner ? `<img class="detail-banner" src="${banner}" alt="">` : ""}
      <div class="detail-grid">
        ${cover ? `<img class="detail-cover" src="${cover}" alt="">` : ""}
        <div class="detail-copy">
          <span class="stamp">ANIME</span>

          <!-- Anime titles are deliberately excluded from translation. -->
          <h1 class="detail-title notranslate" translate="no">${title}</h1>

          <div class="detail-meta">
            ${m.averageScore ? `<span>★ ${escapeHtml(m.averageScore)}%</span>` : ""}
            ${m.episodes ? `<span>${escapeHtml(m.episodes)} episodes</span>` : ""}
            ${m.format ? `<span>${escapeHtml(mediaFormat(m.format))}</span>` : ""}
            ${m.seasonYear ? `<span>${escapeHtml(m.seasonYear)}</span>` : ""}
          </div>

          ${next}
          <div class="tags">${genres}</div>

          <h2 class="detail-subtitle">Synopsis</h2>
          <p class="detail-synopsis">${synopsis}</p>

          <div class="detail-actions">
            <button class="primary" type="button" id="favoriteBtn">☆ Add to my anime</button>
            <button class="ghost" type="button" id="alertBtn">🔔 Notify me about updates</button>
          </div>
        </div>
      </div>
    </article>
  </main>

  <footer>
    <div class="wrap footer">
      <div class="footer-brand notranslate" translate="no">
        <span class="brand-mark small" aria-hidden="true">ア</span>
        <span>Anime Hoje</span>
      </div>
      <span class="footer-links">
        <a href="/sobre.html">About</a>
        <a href="/privacidade.html">Privacy</a>
        <a href="/contato.html">Contact</a>
      </span>
    </div>
  </footer>

  <script src="/js/anime-actions.js"></script>
</body>
</html>`;
}

function renderErrorPage(message, status = 500) {
  const safe = escapeHtml(message);
  return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Anime Hoje</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main class="wrap static-page">
    <h1>Anime Hoje</h1>
    <div class="error">${safe}</div>
    <p><a class="primary" href="/index.html">Back to home</a></p>
  </main>
</body>
</html>`, {
    status,
    headers: securityHeaders({ "Content-Type": "text/html; charset=UTF-8" })
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/anime.html" || url.pathname === "/anime") {
      const id = Number(url.searchParams.get("id"));
      if (!Number.isInteger(id) || id <= 0) {
        return renderErrorPage("Anime not found.", 404);
      }

      // Cache server-side: switching/reloading the browser language should not
      // generate a fresh catalog request every time.
      const cache = caches.default;
      const cacheKey = new Request(`${url.origin}/__anime_cache/${id}`, {
        method: "GET"
      });

      const cached = await cache.match(cacheKey);
      if (cached) {
        const headers = new Headers(cached.headers);
        headers.set("X-Anime-Hoje-Cache", "HIT");
        return new Response(cached.body, {
          status: cached.status,
          statusText: cached.statusText,
          headers
        });
      }

      try {
        const media = await fetchAnime(id);
        if (!media) return renderErrorPage("Anime not found.", 404);

        const response = new Response(renderAnimePage(media), {
          headers: securityHeaders({
            "Content-Type": "text/html; charset=UTF-8",
            "Cache-Control": "public, max-age=1800"
          })
        });

        const cachedCopy = response.clone();
        cachedCopy.headers.set("X-Anime-Hoje-Cache", "MISS");
        ctx.waitUntil(cache.put(cacheKey, cachedCopy));

        const browserResponse = response.clone();
        browserResponse.headers.set("X-Anime-Hoje-Cache", "MISS");
        return browserResponse;
      } catch (error) {
        console.error("Anime detail upstream failure:", error);
        return new Response(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Anime Hoje</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  <main class="wrap static-page">
    <h1>Anime Hoje</h1>
    <div class="error">
      The catalog service is temporarily busy. Please try this page again in a moment.
    </div>
    <p><a class="primary" href="/index.html">Back to home</a></p>
  </main>
</body>
</html>`, {
          status: 503,
          headers: securityHeaders({
            "Content-Type": "text/html; charset=UTF-8",
            "Cache-Control": "no-store",
            "Retry-After": "30"
          })
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
