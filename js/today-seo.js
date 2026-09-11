
const API = "https://graphql.anilist.co";

function esc(value=""){
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

function localDayRange(){
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59,999);
  return {
    start: Math.floor(start.getTime()/1000),
    end: Math.floor(end.getTime()/1000)
  };
}

async function gql(query, variables={}){
  const response = await fetch(API,{
    method:"POST",
    headers:{"Content-Type":"application/json","Accept":"application/json"},
    body:JSON.stringify({query,variables})
  });
  if(!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if(data.errors) throw new Error(data.errors[0]?.message || "API error");
  return data.data;
}

async function loadTodaySeo(){
  const root = document.getElementById("seoTodayGrid");
  if(!root) return;

  const strings = JSON.parse(document.getElementById("seoStrings").textContent);
  const {start,end} = localDayRange();

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
            coverImage { large }
            format
          }
        }
      }
    }
  `;

  try{
    const data = await gql(query,{page:1,start,end});
    const items = data.Page.airingSchedules || [];
    if(!items.length){
      root.innerHTML = `<div class="loading">${esc(strings.empty)}</div>`;
      return;
    }

    root.innerHTML = items.map(item => {
      const title = esc(displayTitle(item.media));
      const img = esc(item.media.coverImage?.large || "");
      const time = new Intl.DateTimeFormat(strings.locale,{
        hour:"2-digit",minute:"2-digit"
      }).format(new Date(item.airingAt*1000));

      return `
        <a class="row" href="/anime.html?id=${encodeURIComponent(item.media.id)}">
          <span class="row-time">${time}</span>
          ${img ? `<img class="row-cover" loading="lazy" src="${img}" alt="">` : ""}
          <span class="row-main">
            <span class="row-title notranslate" translate="no">${title}</span>
            <span class="row-meta">
              <span class="chip">${esc(strings.episode)} ${esc(item.episode)}</span>
              <span>${esc(item.media.format || "Anime")}</span>
            </span>
          </span>
        </a>
      `;
    }).join("");
  }catch(err){
    console.error(err);
    root.innerHTML = `<div class="error">${esc(strings.error)}</div>`;
  }
}

loadTodaySeo();
