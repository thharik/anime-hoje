(() => {
  const STORAGE_KEY = 'animeHojeLanguage';

  const dictionaries = {
    'pt-BR': {
      'meta.homeTitle': 'Anime Hoje — O que saiu hoje?',
      'meta.homeDescription': 'Anime Hoje: veja o que está saindo hoje, próximos episódios e animes em alta.',
      'meta.animeTitle': 'Anime — Anime Hoje',
      'meta.animeDescription': 'Detalhes do anime no Anime Hoje.',
      'meta.aboutTitle': 'Sobre — Anime Hoje',
      'meta.privacyTitle': 'Privacidade — Anime Hoje',
      'meta.contactTitle': 'Contato — Anime Hoje',
      'nav.today': 'Hoje',
      'nav.trending': 'Em alta',
      'nav.news': 'Notícias',
      'nav.back': '← Voltar',
      'hero.title': 'O que estreou hoje, antes de alguém te contar.',
      'hero.lead': 'Horários de exibição e os títulos em alta são atualizados ao longo do dia, para você encontrar rapidamente o que está acontecendo agora.',
      'hero.cta': 'Ver o que estreia hoje',
      'hero.live': 'NO AR AGORA',
      'hero.loading': 'Buscando atualização...',
      'hero.updatedDay': 'Programação atualizada ao longo do dia.',
      'section.today': 'Sai hoje',
      'section.trending': 'Em alta',
      'section.trendingLead': 'Os títulos que estão chamando mais atenção no momento.',
      'section.news': 'Notícias',
      'action.refresh': 'Atualizar agora',
      'action.refreshing': 'Atualizando...',
      'loading.today': 'Carregando episódios de hoje...',
      'loading.trending': 'Carregando animes em alta...',
      'empty.today': 'Nenhum episódio encontrado para hoje nesta consulta.',
      'error.today': 'Não foi possível carregar a programação agora. Tente novamente em instantes.',
      'error.trending': 'Não foi possível carregar os títulos em alta agora.',
      'update.last': 'Última atualização: {date}',
      'episode.short': 'EP {number}',
      'episodes.short': '{number} eps.',
      'format.anime': 'Anime',
      'news.soon': 'EM BREVE',
      'news.title': 'A automação de notícias entra na próxima versão.',
      'news.body': 'Um robô no GitHub vai checar fontes autorizadas em intervalos definidos, atualizar o arquivo de notícias e publicar a nova versão do site sozinho.',
      'footer.version': 'Anime Hoje — versão multilíngue',
      'footer.about': 'Sobre',
      'footer.privacy': 'Privacidade',
      'footer.contact': 'Contato',
      'notify.soon': 'As notificações Web Push serão ativadas em breve.',
      'language.label': 'Idioma',
      'anime.loading': 'Carregando anime...',
      'anime.notFound': 'Anime não encontrado.',
      'anime.backHome': 'Voltar para a página inicial.',
      'anime.badge': 'ANIME',
      'anime.nextEpisode': 'Próximo episódio: episódio {episode} em aproximadamente {hours}h',
      'anime.episodes': '{number} episódios',
      'anime.synopsis': 'Sinopse',
      'anime.synopsisUnavailable': 'Sinopse não disponível.',
      'anime.synopsisOriginal': 'A sinopse desta fonte está em inglês.',
      'anime.translateSynopsis': 'Traduzir sinopse para português',
      'anime.translatingSynopsis': 'Traduzindo...',
      'anime.translationUnavailable': 'A tradução interna não está disponível neste navegador. O restante do site continua em português.',
      'anime.translationError': 'Não foi possível traduzir a sinopse agora.',
      'anime.favorite': '☆ Adicionar aos meus animes',
      'anime.favoriteAdded': '★ Adicionado aos meus animes',
      'anime.alert': '🔔 Avise-me sobre novidades',
      'anime.alertSoon': 'Notificações personalizadas serão ativadas em breve.',
      'anime.loadError': 'Não foi possível carregar este anime agora. Tente novamente em instantes.',
      'about.heading': 'Sobre o Anime Hoje',
      'about.p1': 'O Anime Hoje é um portal independente criado para organizar, de forma rápida e clara, a programação diária de animes, tendências e novidades relevantes.',
      'about.p2': 'Nosso objetivo é oferecer uma experiência limpa, sem redirecionamentos abusivos, downloads inesperados ou anúncios invasivos.',
      'privacy.heading': 'Política de Privacidade',
      'privacy.p1': 'O Anime Hoje busca coletar apenas o mínimo necessário para o funcionamento do site. Recursos como favoritos podem ser armazenados localmente no navegador do usuário.',
      'privacy.p2': 'Quando serviços de notificações, métricas ou publicidade forem adicionados, esta política será atualizada para informar de forma clara quais dados são processados e por quais serviços.',
      'privacy.p3': 'Não vendemos dados pessoais dos visitantes.',
      'contact.heading': 'Contato',
      'contact.p1': 'Esta página será usada para contato editorial, correções e propostas comerciais.',
      'contact.p2': 'Em breve adicionaremos um canal de contato oficial do Anime Hoje.',
      'static.home': 'Voltar ao início',
      'genre.Action': 'Ação',
      'genre.Adventure': 'Aventura',
      'genre.Comedy': 'Comédia',
      'genre.Drama': 'Drama',
      'genre.Ecchi': 'Ecchi',
      'genre.Fantasy': 'Fantasia',
      'genre.Horror': 'Terror',
      'genre.Mahou Shoujo': 'Garota Mágica',
      'genre.Mecha': 'Mecha',
      'genre.Music': 'Música',
      'genre.Mystery': 'Mistério',
      'genre.Psychological': 'Psicológico',
      'genre.Romance': 'Romance',
      'genre.Sci-Fi': 'Ficção científica',
      'genre.Slice of Life': 'Cotidiano',
      'genre.Sports': 'Esportes',
      'genre.Supernatural': 'Sobrenatural',
      'genre.Thriller': 'Suspense',
      'format.TV': 'Série de TV',
      'format.TV_SHORT': 'Série curta',
      'format.MOVIE': 'Filme',
      'format.SPECIAL': 'Especial',
      'format.OVA': 'OVA',
      'format.ONA': 'ONA',
      'format.MUSIC': 'Videoclipe'
    },
    'en-US': {
      'meta.homeTitle': 'Anime Hoje — What aired today?',
      'meta.homeDescription': 'Anime Hoje: see what is airing today, upcoming episodes and trending anime.',
      'meta.animeTitle': 'Anime — Anime Hoje',
      'meta.animeDescription': 'Anime details on Anime Hoje.',
      'meta.aboutTitle': 'About — Anime Hoje',
      'meta.privacyTitle': 'Privacy — Anime Hoje',
      'meta.contactTitle': 'Contact — Anime Hoje',
      'nav.today': 'Today',
      'nav.trending': 'Trending',
      'nav.news': 'News',
      'nav.back': '← Back',
      'hero.title': 'What aired today, before someone spoils it for you.',
      'hero.lead': 'Airing times and trending titles are updated throughout the day so you can quickly see what is happening right now.',
      'hero.cta': 'See what airs today',
      'hero.live': 'LIVE NOW',
      'hero.loading': 'Checking for updates...',
      'hero.updatedDay': 'Schedule updated throughout the day.',
      'section.today': 'Airing today',
      'section.trending': 'Trending',
      'section.trendingLead': 'The titles getting the most attention right now.',
      'section.news': 'News',
      'action.refresh': 'Refresh now',
      'action.refreshing': 'Refreshing...',
      'loading.today': "Loading today's episodes...",
      'loading.trending': 'Loading trending anime...',
      'empty.today': 'No episodes were found for today in this query.',
      'error.today': 'The schedule could not be loaded right now. Please try again shortly.',
      'error.trending': 'Trending titles could not be loaded right now.',
      'update.last': 'Last updated: {date}',
      'episode.short': 'EP {number}',
      'episodes.short': '{number} eps.',
      'format.anime': 'Anime',
      'news.soon': 'COMING SOON',
      'news.title': 'Automatic news is coming in the next version.',
      'news.body': 'A GitHub bot will check approved sources at scheduled intervals, update the news file and publish the new version of the site automatically.',
      'footer.version': 'Anime Hoje — multilingual version',
      'footer.about': 'About',
      'footer.privacy': 'Privacy',
      'footer.contact': 'Contact',
      'notify.soon': 'Web Push notifications are coming soon.',
      'language.label': 'Language',
      'anime.loading': 'Loading anime...',
      'anime.notFound': 'Anime not found.',
      'anime.backHome': 'Back to the home page.',
      'anime.badge': 'ANIME',
      'anime.nextEpisode': 'Next episode: episode {episode} in about {hours}h',
      'anime.episodes': '{number} episodes',
      'anime.synopsis': 'Synopsis',
      'anime.synopsisUnavailable': 'Synopsis unavailable.',
      'anime.synopsisOriginal': '',
      'anime.translateSynopsis': 'Translate synopsis',
      'anime.translatingSynopsis': 'Translating...',
      'anime.translationUnavailable': 'Built-in translation is not available in this browser.',
      'anime.translationError': 'The synopsis could not be translated right now.',
      'anime.favorite': '☆ Add to my anime',
      'anime.favoriteAdded': '★ Added to my anime',
      'anime.alert': '🔔 Notify me about updates',
      'anime.alertSoon': 'Personalized notifications are coming soon.',
      'anime.loadError': 'This anime could not be loaded right now. Please try again shortly.',
      'about.heading': 'About Anime Hoje',
      'about.p1': 'Anime Hoje is an independent portal created to organize daily anime schedules, trends and relevant updates in a fast and clear way.',
      'about.p2': 'Our goal is to provide a clean experience without abusive redirects, unexpected downloads or intrusive ads.',
      'privacy.heading': 'Privacy Policy',
      'privacy.p1': 'Anime Hoje aims to collect only the minimum information required for the site to work. Features such as favorites may be stored locally in the user’s browser.',
      'privacy.p2': 'When notification, analytics or advertising services are added, this policy will be updated to clearly explain what data is processed and by which services.',
      'privacy.p3': 'We do not sell visitors’ personal data.',
      'contact.heading': 'Contact',
      'contact.p1': 'This page will be used for editorial contact, corrections and business proposals.',
      'contact.p2': 'An official Anime Hoje contact channel will be added soon.',
      'static.home': 'Back to home',
      'genre.Action': 'Action',
      'genre.Adventure': 'Adventure',
      'genre.Comedy': 'Comedy',
      'genre.Drama': 'Drama',
      'genre.Ecchi': 'Ecchi',
      'genre.Fantasy': 'Fantasy',
      'genre.Horror': 'Horror',
      'genre.Mahou Shoujo': 'Magical Girl',
      'genre.Mecha': 'Mecha',
      'genre.Music': 'Music',
      'genre.Mystery': 'Mystery',
      'genre.Psychological': 'Psychological',
      'genre.Romance': 'Romance',
      'genre.Sci-Fi': 'Sci-Fi',
      'genre.Slice of Life': 'Slice of Life',
      'genre.Sports': 'Sports',
      'genre.Supernatural': 'Supernatural',
      'genre.Thriller': 'Thriller',
      'format.TV': 'TV Series',
      'format.TV_SHORT': 'TV Short',
      'format.MOVIE': 'Movie',
      'format.SPECIAL': 'Special',
      'format.OVA': 'OVA',
      'format.ONA': 'ONA',
      'format.MUSIC': 'Music Video'
    },
    'es-ES': {
      'meta.homeTitle': 'Anime Hoje — ¿Qué salió hoy?',
      'meta.homeDescription': 'Anime Hoje: mira qué se emite hoy, próximos episodios y animes en tendencia.',
      'meta.animeTitle': 'Anime — Anime Hoje',
      'meta.animeDescription': 'Detalles del anime en Anime Hoje.',
      'meta.aboutTitle': 'Acerca de — Anime Hoje',
      'meta.privacyTitle': 'Privacidad — Anime Hoje',
      'meta.contactTitle': 'Contacto — Anime Hoje',
      'nav.today': 'Hoy',
      'nav.trending': 'Tendencias',
      'nav.news': 'Noticias',
      'nav.back': '← Volver',
      'hero.title': 'Lo que se estrenó hoy, antes de que alguien te lo cuente.',
      'hero.lead': 'Los horarios de emisión y los títulos en tendencia se actualizan durante el día para que veas rápidamente qué está pasando ahora.',
      'hero.cta': 'Ver lo que se estrena hoy',
      'hero.live': 'EN VIVO AHORA',
      'hero.loading': 'Buscando actualizaciones...',
      'hero.updatedDay': 'Programación actualizada durante el día.',
      'section.today': 'Sale hoy',
      'section.trending': 'Tendencias',
      'section.trendingLead': 'Los títulos que más atención están recibiendo ahora.',
      'section.news': 'Noticias',
      'action.refresh': 'Actualizar ahora',
      'action.refreshing': 'Actualizando...',
      'loading.today': 'Cargando episodios de hoy...',
      'loading.trending': 'Cargando animes en tendencia...',
      'empty.today': 'No se encontraron episodios para hoy en esta consulta.',
      'error.today': 'No fue posible cargar la programación ahora. Inténtalo de nuevo en unos instantes.',
      'error.trending': 'No fue posible cargar los títulos en tendencia ahora.',
      'update.last': 'Última actualización: {date}',
      'episode.short': 'EP {number}',
      'episodes.short': '{number} eps.',
      'format.anime': 'Anime',
      'news.soon': 'PRÓXIMAMENTE',
      'news.title': 'Las noticias automáticas llegan en la próxima versión.',
      'news.body': 'Un bot de GitHub revisará fuentes autorizadas en intervalos definidos, actualizará el archivo de noticias y publicará automáticamente la nueva versión del sitio.',
      'footer.version': 'Anime Hoje — versión multilingüe',
      'footer.about': 'Acerca de',
      'footer.privacy': 'Privacidad',
      'footer.contact': 'Contacto',
      'notify.soon': 'Las notificaciones Web Push estarán disponibles pronto.',
      'language.label': 'Idioma',
      'anime.loading': 'Cargando anime...',
      'anime.notFound': 'Anime no encontrado.',
      'anime.backHome': 'Volver a la página de inicio.',
      'anime.badge': 'ANIME',
      'anime.nextEpisode': 'Próximo episodio: episodio {episode} en aproximadamente {hours}h',
      'anime.episodes': '{number} episodios',
      'anime.synopsis': 'Sinopsis',
      'anime.synopsisUnavailable': 'Sinopsis no disponible.',
      'anime.synopsisOriginal': 'La sinopsis de esta fuente está en inglés.',
      'anime.translateSynopsis': 'Traducir sinopsis al español',
      'anime.translatingSynopsis': 'Traduciendo...',
      'anime.translationUnavailable': 'La traducción interna no está disponible en este navegador. El resto del sitio continúa en español.',
      'anime.translationError': 'No fue posible traducir la sinopsis ahora.',
      'anime.favorite': '☆ Añadir a mis animes',
      'anime.favoriteAdded': '★ Añadido a mis animes',
      'anime.alert': '🔔 Avísame de novedades',
      'anime.alertSoon': 'Las notificaciones personalizadas estarán disponibles pronto.',
      'anime.loadError': 'No fue posible cargar este anime ahora. Inténtalo de nuevo en unos instantes.',
      'about.heading': 'Acerca de Anime Hoje',
      'about.p1': 'Anime Hoje es un portal independiente creado para organizar de forma rápida y clara la programación diaria de anime, tendencias y novedades relevantes.',
      'about.p2': 'Nuestro objetivo es ofrecer una experiencia limpia, sin redirecciones abusivas, descargas inesperadas ni anuncios invasivos.',
      'privacy.heading': 'Política de Privacidad',
      'privacy.p1': 'Anime Hoje busca recopilar solo lo mínimo necesario para el funcionamiento del sitio. Funciones como favoritos pueden almacenarse localmente en el navegador del usuario.',
      'privacy.p2': 'Cuando se añadan servicios de notificaciones, métricas o publicidad, esta política se actualizará para informar claramente qué datos se procesan y mediante qué servicios.',
      'privacy.p3': 'No vendemos datos personales de los visitantes.',
      'contact.heading': 'Contacto',
      'contact.p1': 'Esta página se utilizará para contacto editorial, correcciones y propuestas comerciales.',
      'contact.p2': 'Pronto añadiremos un canal de contacto oficial de Anime Hoje.',
      'static.home': 'Volver al inicio',
      'genre.Action': 'Acción',
      'genre.Adventure': 'Aventura',
      'genre.Comedy': 'Comedia',
      'genre.Drama': 'Drama',
      'genre.Ecchi': 'Ecchi',
      'genre.Fantasy': 'Fantasía',
      'genre.Horror': 'Terror',
      'genre.Mahou Shoujo': 'Chica mágica',
      'genre.Mecha': 'Mecha',
      'genre.Music': 'Música',
      'genre.Mystery': 'Misterio',
      'genre.Psychological': 'Psicológico',
      'genre.Romance': 'Romance',
      'genre.Sci-Fi': 'Ciencia ficción',
      'genre.Slice of Life': 'Recuentos de la vida',
      'genre.Sports': 'Deportes',
      'genre.Supernatural': 'Sobrenatural',
      'genre.Thriller': 'Suspenso',
      'format.TV': 'Serie de TV',
      'format.TV_SHORT': 'Serie corta',
      'format.MOVIE': 'Película',
      'format.SPECIAL': 'Especial',
      'format.OVA': 'OVA',
      'format.ONA': 'ONA',
      'format.MUSIC': 'Video musical'
    }
  };

  function normalizeLocale(raw) {
    const value = String(raw || '').toLowerCase();
    if (value.startsWith('pt')) return 'pt-BR';
    if (value.startsWith('es')) return 'es-ES';
    if (value.startsWith('en')) return 'en-US';
    return 'en-US';
  }

  function detectLocale() {
    const langs = navigator.languages?.length ? navigator.languages : [navigator.language || 'en-US'];
    for (const lang of langs) {
      const normalized = normalizeLocale(lang);
      if (dictionaries[normalized]) return normalized;
    }
    return 'en-US';
  }

  const preference = localStorage.getItem(STORAGE_KEY) || 'auto';
  const locale = preference === 'auto' ? detectLocale() : normalizeLocale(preference);

  function t(key, vars = {}) {
    let value = dictionaries[locale]?.[key] ?? dictionaries['en-US']?.[key] ?? key;
    Object.entries(vars).forEach(([name, replacement]) => {
      value = value.replaceAll(`{${name}}`, String(replacement));
    });
    return value;
  }

  function applyTranslations(root = document) {
    document.documentElement.lang = locale;

    root.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-content]').forEach(el => {
      el.setAttribute('content', t(el.dataset.i18nContent));
    });
    root.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.setAttribute('title', t(el.dataset.i18nTitle));
    });
    root.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
    });

    const select = root.querySelector('#languageSelect');
    if (select) {
      select.value = preference === 'auto' ? 'auto' : locale;
      select.setAttribute('aria-label', t('language.label'));
      select.addEventListener('change', () => {
        const value = select.value;
        if (value === 'auto') localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, value);
        location.reload();
      });
    }
  }

  function formatDate(date, options) {
    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  function genre(name) {
    return t(`genre.${name}`) === `genre.${name}` ? name : t(`genre.${name}`);
  }

  function mediaFormat(format) {
    if (!format) return t('format.anime');
    const key = `format.${format}`;
    const translated = t(key);
    return translated === key ? format.replaceAll('_', ' ') : translated;
  }

  window.AnimeHojeI18n = {
    locale,
    language: locale.split('-')[0],
    preference,
    t,
    applyTranslations,
    formatDate,
    genre,
    mediaFormat
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applyTranslations());
  } else {
    applyTranslations();
  }
})();
