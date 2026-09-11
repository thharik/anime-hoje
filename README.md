# Anime Hoje — V1.3

## O que já funciona
- Programação de episódios do dia carregada automaticamente.
- Ranking de títulos em alta carregado automaticamente.
- Página interna de cada anime (`anime.html?id=...`).
- Favoritos salvos no próprio navegador (sem banco de dados).
- Headers de segurança via `_headers` no Cloudflare Workers Static Assets.
- Páginas de Sobre, Privacidade e Contato.
- `robots.txt` e `sitemap.xml` para base de SEO.

## Segurança
O arquivo `_headers` adiciona CSP, proteção contra iframe/clickjacking, `nosniff`, política de permissões, referrer policy e HSTS.

## Próximas etapas
- Notícias automáticas.
- Notificações Web Push.
- Monetização com afiliados e, depois, anúncios.
