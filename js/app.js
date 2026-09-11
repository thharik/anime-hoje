const DATA_API = "https://graphql.anilist.co";
const I18N = window.AnimeHojeI18n;
const t = (key, vars) => I18N.t(key, vars);

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
  if(I18N.language === 'en') return media?.title?.english || media?.title?.romaji || media?.title?.userPreferred || media?.title?.native || "Anime";
  return media?.title?.english || media?.title?.userPreferred || media?.title?.romaji || media?.title?.native || "Anime";
}

function formatTime(unix){
  return I18N.formatDate(new Date(unix * 1000), {hour:"2-digit", minute:"2-digit"});
}

function formatDateLong(date){
  return I18N.formatDate(date, {weekday:"long", day:"2-digit", month:"long", year:"numeric"});
}

function tickClock(){
  if(!liveClock) return;
  liveClock.textContent = I18N.formatDate(new Date(), {hour:"2-digit", minute:"2-digit", second:"2-digit"});
}

function localDayRange(){
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59,999);
  return {start:Math.floor(start.getTime()/1000), end:Math.floor(end.getTime()/1000), now};
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

async function loadToday(){
  const {start,end,now} = localDayRange();
  const dateLabel = formatDateLong(now);
  todayLabel.textContent = dateLabel;
  if(todayLabelHero) todayLabelHero.textContent = dateLabel;
  todayGrid.innerHTML = `<div class="loading">${escapeHtml(t('loading.today'))}</div>`;

  const query = `
    query ($page:Int,$start:Int,$end:Int) {
      Page(page:$page, perPage:24) {
        airingSchedules(airingAt_greater:$start,airingAt_lesser:$end,sort:TIME) {
          airingAt episode
          media { id title { userPreferred romaji english native } coverImage { large color } format status }
        }
      }
    }
  `;

  try{
    const data = await gql(query,{page:1,start,end});
    const items = data.Page.airingSchedules || [];
    if(!items.length){
      todayGrid.innerHTML = `<div class="loading">${escapeHtml(t('empty.today'))}</div>`;
      return;
    }
    todayGrid.innerHTML = items.map(item => {
      const title = escapeHtml(displayTitle(item.media));
      const img = escapeHtml(item.media.coverImage?.large || "");
      const url = `anime.html?id=${encodeURIComponent(item.media.id)}`;
      return `
        <a class="row" href="${url}">
          <span class="row-time">${formatTime(item.airingAt)}</span>
          ${img ? `<img class="row-cover" loading="lazy" src="${img}" alt="${title}">` : `<span class="row-cover" aria-hidden="true"></span>`}
          <span class="row-main">
            <span class="row-title">${title}</span>
            <span class="row-meta">
              <span class="chip">${escapeHtml(t('episode.short',{number:item.episode}))}</span>
              <span>${escapeHtml(I18N.mediaFormat(item.media.format))}</span>
            </span>
          </span>
        </a>`;
    }).join("");
  }catch(err){
    console.error(err);
    todayGrid.innerHTML = `<div class="error">${escapeHtml(t('error.today'))}</div>`;
  }
}

async function loadTrending(){
  trendingGrid.innerHTML = `<div class="loading">${escapeHtml(t('loading.trending'))}</div>`;
  const query = `
    query {
      Page(page:1, perPage:8) {
        media(type:ANIME, sort:TRENDING_DESC, isAdult:false) {
          id title { userPreferred romaji english native } coverImage { large color } averageScore episodes status
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
      const url = `anime.html?id=${encodeURIComponent(media.id)}`;
      const rank = String(index + 1).padStart(2,"0");
      return `
        <a class="rank-row" href="${url}">
          <span class="rank-num">${rank}</span>
          ${img ? `<img class="rank-cover" loading="lazy" src="${img}" alt="${title}">` : `<span class="rank-cover" aria-hidden="true"></span>`}
          <span class="rank-main">
            <span class="rank-title">${title}</span>
            <span class="rank-meta">
              ${media.averageScore ? `<span class="score">★ ${media.averageScore}%</span>` : ""}
              ${media.episodes ? `<span class="eps">${escapeHtml(t('episodes.short',{number:media.episodes}))}</span>` : ""}
            </span>
          </span>
        </a>`;
    }).join("");
  }catch(err){
    console.error(err);
    trendingGrid.innerHTML = `<div class="error">${escapeHtml(t('error.trending'))}</div>`;
  }
}

async function refreshAll(){
  refreshBtn.disabled = true;
  refreshBtn.textContent = t('action.refreshing');
  await Promise.all([loadToday(), loadTrending()]);
  const formatted = I18N.formatDate(new Date(), {dateStyle:"short",timeStyle:"short"});
  lastUpdate.textContent = t('update.last',{date:formatted});
  refreshBtn.disabled = false;
  refreshBtn.textContent = t('action.refresh');
}

refreshBtn.addEventListener("click", refreshAll);
notifyBtn.addEventListener("click", () => alert(t('notify.soon')));

tickClock();
setInterval(tickClock, 1000);
refreshAll();
