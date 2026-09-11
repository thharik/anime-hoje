const DATA_API = "https://graphql.anilist.co";
const detail = document.getElementById("animeDetail");

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
}

function cleanText(html=""){
  const doc = new DOMParser().parseFromString(String(html || ""), "text/html");
  return doc.body.textContent?.trim() || "Synopsis unavailable.";
}

function displayTitle(media){
  return media?.title?.romaji ||
         media?.title?.userPreferred ||
         media?.title?.native ||
         media?.title?.english ||
         "Anime";
}

function mediaFormat(value){
  const map = {
    TV:"TV Series", TV_SHORT:"TV Short", MOVIE:"Movie",
    SPECIAL:"Special", OVA:"OVA", ONA:"ONA", MUSIC:"Music Video"
  };
  return map[value] || value || "Anime";
}

async function gql(query, variables={}){
  const response = await fetch(DATA_API,{
    method:"POST",
    headers:{"Content-Type":"application/json","Accept":"application/json"},
    body:JSON.stringify({query,variables})
  });
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if(data.errors) throw new Error(data.errors[0]?.message || "API error");
  return data.data;
}

async function loadAnime(){
  const id = Number(new URLSearchParams(location.search).get("id"));
  if(!Number.isInteger(id) || id <= 0){
    detail.innerHTML = '<div class="error">Anime not found. <a href="index.html">Back to the home page.</a></div>';
    return;
  }

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

  try{
    const data = await gql(query,{id});
    const m = data.Media;
    const rawTitle = displayTitle(m);
    const title = escapeHtml(rawTitle);
    document.title = `${rawTitle} — Anime Hoje`;

    const cover = escapeHtml(m.coverImage?.extraLarge || m.coverImage?.large || "");
    const synopsis = escapeHtml(cleanText(m.description));
    const genres = (m.genres || []).map(g => `<span class="tag">${escapeHtml(g)}</span>`).join("");
    const next = m.nextAiringEpisode
      ? `<div class="detail-next"><strong>Next episode: episode ${escapeHtml(m.nextAiringEpisode.episode)} in approximately ${Math.max(1,Math.ceil(m.nextAiringEpisode.timeUntilAiring/3600))}h</strong></div>`
      : "";

    detail.innerHTML = `
      <article class="detail-card">
        ${m.bannerImage ? `<img class="detail-banner" src="${escapeHtml(m.bannerImage)}" alt="">` : ""}
        <div class="detail-grid">
          ${cover ? `<img class="detail-cover" src="${cover}" alt="">` : ""}
          <div class="detail-copy">
            <span class="stamp">ANIME</span>
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
            <p class="detail-synopsis" id="synopsisText">${synopsis}</p>

            <div class="detail-actions">
              <button class="primary" type="button" id="favoriteBtn">☆ Add to my anime</button>
              <button class="ghost" type="button" id="alertBtn">🔔 Notify me about updates</button>
            </div>
          </div>
        </div>
      </article>`;

    const favorites = new Set(JSON.parse(localStorage.getItem("animeHojeFavorites") || "[]"));
    const favoriteBtn = document.getElementById("favoriteBtn");

    if(favorites.has(id)) favoriteBtn.textContent = "★ Added to my anime";

    favoriteBtn?.addEventListener("click", () => {
      favorites.add(id);
      localStorage.setItem("animeHojeFavorites", JSON.stringify([...favorites]));
      favoriteBtn.textContent = "★ Added to my anime";
    });

    document.getElementById("alertBtn")?.addEventListener("click", () => {
      document.getElementById("alertBtn").textContent = "🔔 Notifications coming soon";
    });

  }catch(err){
    console.error(err);
    detail.innerHTML = '<div class="error">This anime could not be loaded right now. Please try again shortly.</div>';
  }
}

loadAnime();
