# Anime Hoje — V1.4 Multilíngue

## Idiomas
- Português do Brasil
- English (US)
- Español
- Modo Auto: detecta o idioma preferido do navegador, sem usar geolocalização.
- O visitante pode trocar manualmente o idioma e a preferência fica salva no navegador.

## O que é traduzido automaticamente
- Menus, botões, mensagens, páginas institucionais, datas e horários.
- Gêneros e formatos dos animes.
- Conteúdo próprio do Anime Hoje.

## Sinopses externas
As sinopses recebidas da fonte de catálogo podem vir em inglês. Em navegadores compatíveis com a Translator API, o usuário pode clicar em “Traduzir sinopse”; a tradução é feita pela função interna do navegador e fica salva localmente para as próximas visitas. Em navegadores sem essa API, o restante do site continua no idioma escolhido.

## Segurança e privacidade
A detecção usa `navigator.language` / `navigator.languages`; não pede localização do usuário e não usa IP para escolher idioma.

## Próxima evolução
Para tradução 100% automática de sinopses e notícias em todos os navegadores, pode-se adicionar tradução no Cloudflare Worker e cachear os resultados.
