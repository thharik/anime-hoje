const API = "https://graphql.anilist.co";

const todayGrid = document.getElementById("todayGrid");
const trendingGrid = document.getElementById("trendingGrid");
const lastUpdate = document.getElementById("lastUpdate");
const todayLabel = document.getElementById("todayLabel");
const todayLabelHero = document.getElementById("todayLabelHero");
const liveClock = document.getElementById("liveClock");
const refreshBtn = document.getElementById("refreshBtn");
const notifyBtn = document.getElementById("notifyBtn");

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
}

function displayTitle(media){
  return media?.title?.userPreferred ||
         media?.title?.romaji ||
         media?.title?.english ||
         media?.title?.native ||
         "Título não informado";
}

function formatTime(unix){
  return new Intl.DateTimeFormat("pt-BR",{
    hour:"2-digit", minute:"2-digit"
  }).format(new Date(unix * 1000));
}

function formatDateLong(date){
  return new Intl.DateTimeFormat("pt-BR",{
    weekday:"long", day:"2-digit", month:"long", year:"numeric"
  }).format(date);
}

// Relógio ao vivo no cabeçalho — reforça a ideia de "programação em tempo real".
function tickClock(){
  if(!liveClock) return;
  liveClock.textContent = new Intl.DateTimeFormat("pt-BR",{
    hour:"2-digit", minute:"2-digit", second:"2-digit"
  }).format(new Date());
}

// Dia local do visitante.
// Para a V2 podemos fixar "Hoje" no horário de Brasília, se preferir.
function localDayRange(){
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59,999);
  return {
    start: Math.floor(start.getTime()/1000),
    end: Math.floor(end.getTime()/1000),
    now
  };
}

async function gql(query, variables={}){
  const response = await fetch(API,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body:JSON.stringify({query,variables})
  });
  if(!response.ok) throw new Error(`AniList retornou HTTP ${response.status}`);
  const data = await response.json();
  if(data.errors) throw new Error(data.errors[0]?.message || "Erro na API");
  return data.data;
}

async function loadToday(){
  const {start,end,now} = localDayRange();
  const dateLabel = formatDateLong(now);
  todayLabel.textContent = dateLabel;
  if(todayLabelHero) todayLabelHero.textContent = dateLabel;

  todayGrid.innerHTML = '<div class="loading">Carregando episódios de hoje...</div>';

  const query = `
    query ($page:Int,$start:Int,$end:Int) {
      Page(page:$page, perPage:24) {
        airingSchedules(
          airingAt_greater:$start,
          airingAt_lesser:$end,
          sort:TIME
        ) {
          airingAt
          episode
          media {
            id
            title { userPreferred romaji english native }
            coverImage { large color }
            siteUrl
            format
            status
          }
        }
      }
    }
  `;

  try{
    const data = await gql(query,{page:1,start,end});
    const items = data.Page.airingSchedules || [];

    if(!items.length){
      todayGrid.innerHTML = '<div class="loading">Nenhum episódio encontrado para hoje nesta consulta.</div>';
      return;
    }

    todayGrid.innerHTML = items.map(item => {
      const title = escapeHtml(displayTitle(item.media));
      const img = escapeHtml(item.media.coverImage?.large || "");
      const url = escapeHtml(item.media.siteUrl || "#");
      return `
        <a class="row" href="${url}" target="_blank" rel="noopener noreferrer">
          <span class="row-time">${formatTime(item.airingAt)}</span>
          ${img ? `<img class="row-cover" loading="lazy" src="${img}" alt="Capa de ${title}">` : `<span class="row-cover" aria-hidden="true"></span>`}
          <span class="row-main">
            <span class="row-title">${title}</span>
            <span class="row-meta">
              <span class="chip">EP ${escapeHtml(item.episode)}</span>
              <span>${escapeHtml(item.media.format || "Anime")}</span>
            </span>
          </span>
        </a>
      `;
    }).join("");
  }catch(err){
    console.error(err);
    todayGrid.innerHTML = `<div class="error">Não foi possível carregar a programação agora. Tente novamente em instantes.<br><small>${escapeHtml(err.message)}</small></div>`;
  }
}

async function loadTrending(){
  trendingGrid.innerHTML = '<div class="loading">Carregando animes em alta...</div>';

  const query = `
    query {
      Page(page:1, perPage:8) {
        media(type:ANIME, sort:TRENDING_DESC, isAdult:false) {
          id
          title { userPreferred romaji english native }
          coverImage { large color }
          siteUrl
          averageScore
          episodes
          status
        }
      }
    }
  `;

  try{
    const data = await gql(query);
    const items = data.Page.media || [];

    trendingGrid.innerHTML = items.map((media, index) => {
      const title = escapeHtml(displayTitle(media));
      const img = escapeHtml(media.coverImage?.large || "");
      const url = escapeHtml(media.siteUrl || "#");
      const rank = String(index + 1).padStart(2,"0");
      return `
        <a class="rank-row" href="${url}" target="_blank" rel="noopener noreferrer">
          <span class="rank-num">${rank}</span>
          ${img ? `<img class="rank-cover" loading="lazy" src="${img}" alt="Capa de ${title}">` : `<span class="rank-cover" aria-hidden="true"></span>`}
          <span class="rank-main">
            <span class="rank-title">${title}</span>
            <span class="rank-meta">
              ${media.averageScore ? `<span class="score">★ ${media.averageScore}%</span>` : ""}
              ${media.episodes ? `<span class="eps">${media.episodes} eps.</span>` : ""}
            </span>
          </span>
        </a>
      `;
    }).join("");
  }catch(err){
    console.error(err);
    trendingGrid.innerHTML = `<div class="error">Não foi possível carregar os títulos em alta agora.<br><small>${escapeHtml(err.message)}</small></div>`;
  }
}

async function refreshAll(){
  refreshBtn.disabled = true;
  refreshBtn.textContent = "Atualizando...";
  await Promise.all([loadToday(), loadTrending()]);
  const now = new Date();
  lastUpdate.textContent = "Última atualização: " + new Intl.DateTimeFormat("pt-BR",{
    dateStyle:"short", timeStyle:"short"
  }).format(now);
  refreshBtn.disabled = false;
  refreshBtn.textContent = "Atualizar agora";
}

refreshBtn.addEventListener("click", refreshAll);

notifyBtn.addEventListener("click", () => {
  alert("As notificações Web Push serão ligadas na etapa 3. O botão já está reservado no layout.");
});

tickClock();
setInterval(tickClock, 1000);
refreshAll();
