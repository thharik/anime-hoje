const DATA_API = "https://graphql.anilist.co";
const detail = document.getElementById("animeDetail");

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
}
function cleanText(html=""){
  const doc = new DOMParser().parseFromString(String(html), "text/html");
  return doc.body.textContent?.trim() || "Sinopse não disponível.";
}
function displayTitle(media){
  return media?.title?.english || media?.title?.userPreferred || media?.title?.romaji || media?.title?.native || "Anime";
}
async function gql(query, variables={}){
  const response = await fetch(DATA_API,{
    method:"POST",
    headers:{"Content-Type":"application/json","Accept":"application/json"},
    body:JSON.stringify({query,variables})
  });
  if(!response.ok) throw new Error(`Serviço de dados retornou HTTP ${response.status}`);
  const data = await response.json();
  if(data.errors) throw new Error(data.errors[0]?.message || "Erro ao carregar dados");
  return data.data;
}
async function loadAnime(){
  const id = Number(new URLSearchParams(location.search).get("id"));
  if(!Number.isInteger(id) || id <= 0){
    detail.innerHTML = '<div class="error">Anime não encontrado. <a href="index.html">Voltar para a página inicial.</a></div>';
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
    const title = escapeHtml(displayTitle(m));
    document.title = `${title} — Anime Hoje`;
    const cover = escapeHtml(m.coverImage?.extraLarge || m.coverImage?.large || "");
    const synopsis = escapeHtml(cleanText(m.description));
    const genres = (m.genres || []).map(g => `<span class="tag">${escapeHtml(g)}</span>`).join("");
    const next = m.nextAiringEpisode ? `<div class="detail-next"><strong>Próximo episódio:</strong> episódio ${escapeHtml(m.nextAiringEpisode.episode)} em ${Math.max(1,Math.ceil(m.nextAiringEpisode.timeUntilAiring/3600))}h</div>` : "";
    detail.innerHTML = `
      <article class="detail-card">
        ${m.bannerImage ? `<img class="detail-banner" src="${escapeHtml(m.bannerImage)}" alt="">` : ""}
        <div class="detail-grid">
          ${cover ? `<img class="detail-cover" src="${cover}" alt="Capa de ${title}">` : ""}
          <div class="detail-copy">
            <span class="stamp">ANIME</span>
            <h1 class="detail-title">${title}</h1>
            <div class="detail-meta">
              ${m.averageScore ? `<span>★ ${escapeHtml(m.averageScore)}%</span>` : ""}
              ${m.episodes ? `<span>${escapeHtml(m.episodes)} episódios</span>` : ""}
              ${m.format ? `<span>${escapeHtml(m.format)}</span>` : ""}
              ${m.seasonYear ? `<span>${escapeHtml(m.seasonYear)}</span>` : ""}
            </div>
            ${next}
            <div class="tags">${genres}</div>
            <h2 class="detail-subtitle">Sinopse</h2>
            <p class="detail-synopsis">${synopsis}</p>
            <div class="detail-actions">
              <button class="primary" type="button" id="favoriteBtn">☆ Adicionar aos meus animes</button>
              <button class="ghost" type="button" id="alertBtn">🔔 Avise-me sobre novidades</button>
            </div>
          </div>
        </div>
      </article>
    `;
    document.getElementById("favoriteBtn")?.addEventListener("click",()=>{
      const key = "animeHojeFavorites";
      const items = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
      items.add(id);
      localStorage.setItem(key, JSON.stringify([...items]));
      document.getElementById("favoriteBtn").textContent = "★ Adicionado aos meus animes";
    });
    document.getElementById("alertBtn")?.addEventListener("click",()=>alert("Notificações personalizadas serão ativadas em breve."));
  }catch(err){
    console.error(err);
    detail.innerHTML = `<div class="error">Não foi possível carregar este anime agora. Tente novamente em instantes.</div>`;
  }
}
loadAnime();
