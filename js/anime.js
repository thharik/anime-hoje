const DATA_API = "https://graphql.anilist.co";
const detail = document.getElementById("animeDetail");
const I18N = window.AnimeHojeI18n;
const t = (key, vars) => I18N.t(key, vars);

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
}
function cleanText(html=""){
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return doc.body.textContent?.trim() || t('anime.synopsisUnavailable');
}
function displayTitle(media){
  if(I18N.language === 'en') return media?.title?.english || media?.title?.romaji || media?.title?.userPreferred || media?.title?.native || "Anime";
  return media?.title?.english || media?.title?.userPreferred || media?.title?.romaji || media?.title?.native || "Anime";
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

async function translateSynopsisOnDevice(text, targetLanguage, button, paragraph, note, cacheKey){
  if(!('Translator' in window)){
    note.textContent = t('anime.translationUnavailable');
    button.disabled = true;
    return;
  }
  try{
    button.disabled = true;
    button.textContent = t('anime.translatingSynopsis');
    const target = targetLanguage === 'pt' ? 'pt' : targetLanguage === 'es' ? 'es' : 'en';
    const availability = await Translator.availability({sourceLanguage:'en',targetLanguage:target});
    if(availability === 'unavailable') throw new Error('unavailable');
    const translator = await Translator.create({sourceLanguage:'en',targetLanguage:target});
    const translated = await translator.translate(text);
    paragraph.textContent = translated;
    localStorage.setItem(cacheKey, translated);
    note.remove();
    button.remove();
    translator.destroy?.();
  }catch(err){
    console.error(err);
    note.textContent = err.message === 'unavailable' ? t('anime.translationUnavailable') : t('anime.translationError');
    button.disabled = false;
    button.textContent = t('anime.translateSynopsis');
  }
}

async function loadAnime(){
  const id = Number(new URLSearchParams(location.search).get("id"));
  if(!Number.isInteger(id) || id <= 0){
    detail.innerHTML = `<div class="error">${escapeHtml(t('anime.notFound'))} <a href="index.html">${escapeHtml(t('anime.backHome'))}</a></div>`;
    return;
  }
  const query = `
    query ($id:Int) {
      Media(id:$id, type:ANIME) {
        id title { userPreferred romaji english native }
        coverImage { extraLarge large } bannerImage description genres averageScore episodes duration status season seasonYear format
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
    const originalSynopsis = cleanText(m.description);
    const cacheKey = `animeHojeSynopsis:${id}:${I18N.language}`;
    const cachedSynopsis = I18N.language === 'en' ? '' : localStorage.getItem(cacheKey) || '';
    const synopsis = escapeHtml(cachedSynopsis || originalSynopsis);
    const genres = (m.genres || []).map(g => `<span class="tag">${escapeHtml(I18N.genre(g))}</span>`).join("");
    const next = m.nextAiringEpisode ? `<div class="detail-next"><strong>${escapeHtml(t('anime.nextEpisode',{episode:m.nextAiringEpisode.episode,hours:Math.max(1,Math.ceil(m.nextAiringEpisode.timeUntilAiring/3600))}))}</strong></div>` : "";
    const synopsisNeedsTranslation = I18N.language !== 'en' && !cachedSynopsis && originalSynopsis !== t('anime.synopsisUnavailable');

    detail.innerHTML = `
      <article class="detail-card">
        ${m.bannerImage ? `<img class="detail-banner" src="${escapeHtml(m.bannerImage)}" alt="">` : ""}
        <div class="detail-grid">
          ${cover ? `<img class="detail-cover" src="${cover}" alt="${title}">` : ""}
          <div class="detail-copy">
            <span class="stamp">${escapeHtml(t('anime.badge'))}</span>
            <h1 class="detail-title">${title}</h1>
            <div class="detail-meta">
              ${m.averageScore ? `<span>★ ${escapeHtml(m.averageScore)}%</span>` : ""}
              ${m.episodes ? `<span>${escapeHtml(t('anime.episodes',{number:m.episodes}))}</span>` : ""}
              ${m.format ? `<span>${escapeHtml(I18N.mediaFormat(m.format))}</span>` : ""}
              ${m.seasonYear ? `<span>${escapeHtml(m.seasonYear)}</span>` : ""}
            </div>
            ${next}
            <div class="tags">${genres}</div>
            <h2 class="detail-subtitle">${escapeHtml(t('anime.synopsis'))}</h2>
            <p class="detail-synopsis" id="synopsisText">${synopsis}</p>
            ${synopsisNeedsTranslation ? `<div class="translation-tools"><small id="translationNote">${escapeHtml(t('anime.synopsisOriginal'))}</small><button class="ghost" id="translateSynopsisBtn" type="button">${escapeHtml(t('anime.translateSynopsis'))}</button></div>` : ""}
            <div class="detail-actions">
              <button class="primary" type="button" id="favoriteBtn">${escapeHtml(t('anime.favorite'))}</button>
              <button class="ghost" type="button" id="alertBtn">${escapeHtml(t('anime.alert'))}</button>
            </div>
          </div>
        </div>
      </article>`;

    const favorites = new Set(JSON.parse(localStorage.getItem('animeHojeFavorites') || '[]'));
    if(favorites.has(id)) document.getElementById('favoriteBtn').textContent = t('anime.favoriteAdded');

    document.getElementById("favoriteBtn")?.addEventListener("click",()=>{
      favorites.add(id);
      localStorage.setItem('animeHojeFavorites', JSON.stringify([...favorites]));
      document.getElementById("favoriteBtn").textContent = t('anime.favoriteAdded');
    });
    document.getElementById("alertBtn")?.addEventListener("click",()=>alert(t('anime.alertSoon')));

    const translateButton = document.getElementById('translateSynopsisBtn');
    if(translateButton){
      translateButton.addEventListener('click',()=>translateSynopsisOnDevice(
        originalSynopsis,
        I18N.language,
        translateButton,
        document.getElementById('synopsisText'),
        document.getElementById('translationNote'),
        cacheKey
      ));
    }
  }catch(err){
    console.error(err);
    detail.innerHTML = `<div class="error">${escapeHtml(t('anime.loadError'))}</div>`;
  }
}
loadAnime();
