const DATA_API = "https://graphql.anilist.co";

const todayGrid = document.getElementById("todayGrid");
const trendingGrid = document.getElementById("trendingGrid");
const lastUpdate = document.getElementById("lastUpdate");
const todayLabel = document.getElementById("todayLabel");
const todayLabelHero = document.getElementById("todayLabelHero");
const liveClock = document.getElementById("liveClock");
const notifyBtn = document.getElementById("notifyBtn");

function escapeHtml(value=""){
  return String(value).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[s]));
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

function formatTime(unix){
  return new Intl.DateTimeFormat("en-US", {
    hour:"2-digit", minute:"2-digit"
  }).format(new Date(unix * 1000));
}

function formatDateLong(date){
  return new Intl.DateTimeFormat("en-US", {
    weekday:"long", day:"2-digit", month:"long", year:"numeric"
  }).format(date);
}

function tickClock(){
  if(!liveClock) return;
  liveClock.textContent = new Intl.DateTimeFormat("en-US", {
    hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false
  }).format(new Date());
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
  todayGrid.innerHTML = "<div class=\"loading\">Loading today's episodes...</div>";

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
      todayGrid.innerHTML = '<div class="loading">No episodes were found for today in this query.</div>';
      return;
    }
    todayGrid.innerHTML = items.map(item => {
      const title = escapeHtml(displayTitle(item.media));
      const img = escapeHtml(item.media.coverImage?.large || "");
      const url = `anime.html?id=${encodeURIComponent(item.media.id)}`;
      return `
        <a class="row" href="${url}">
          <span class="row-time">${formatTime(item.airingAt)}</span>
          ${img ? `<img class="row-cover" loading="lazy" src="${img}" alt="">` : `<span class="row-cover" aria-hidden="true"></span>`}
          <span class="row-main">
            <span class="row-title notranslate" translate="no">${title}</span>
            <span class="row-meta">
              <span class="chip">EP ${escapeHtml(item.episode)}</span>
              <span>${escapeHtml(mediaFormat(item.media.format))}</span>
            </span>
          </span>
        </a>`;
    }).join("");
  }catch(err){
    console.error(err);
    todayGrid.innerHTML = '<div class="error">The schedule could not be loaded right now. Please try again shortly.</div>';
  }
}

async function loadTrending(){
  trendingGrid.innerHTML = '<div class="loading">Loading trending anime...</div>';
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
          ${img ? `<img class="rank-cover" loading="lazy" src="${img}" alt="">` : `<span class="rank-cover" aria-hidden="true"></span>`}
          <span class="rank-main">
            <span class="rank-title notranslate" translate="no">${title}</span>
            <span class="rank-meta">
              ${media.averageScore ? `<span class="score">★ ${media.averageScore}%</span>` : ""}
              ${media.episodes ? `<span class="eps">${media.episodes} eps.</span>` : ""}
            </span>
          </span>
        </a>`;
    }).join("");
  }catch(err){
    console.error(err);
    trendingGrid.innerHTML = '<div class="error">Trending titles could not be loaded right now.</div>';
  }
}

async function refreshAll(){
  await Promise.all([loadToday(), loadTrending()]);
  const formatted = new Intl.DateTimeFormat("en-US", {
    dateStyle:"short",timeStyle:"short"
  }).format(new Date());
  lastUpdate.textContent = `Last update: ${formatted}`;
}

notifyBtn.addEventListener("click", () => {
  notifyBtn.title = "Web Push notifications are coming soon.";
});

tickClock();
setInterval(tickClock, 1000);
refreshAll();
