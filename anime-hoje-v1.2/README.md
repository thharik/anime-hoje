# Anime Hoje — V1

Primeira versão do portal.

## O que já funciona
- "Sai hoje": consulta a API do AniList quando a página é aberta.
- "Em alta": consulta a API do AniList quando a página é aberta.
- Botão "Atualizar agora".
- Layout responsivo para desktop e celular.
- Identidade visual "guia de programação/broadcast": paleta tinta/papel/vermelhão, tipografia condensada + grotesca japonesa, horários em formato de grade de TV e relógio ao vivo no cabeçalho.

## Como a atualização funciona nesta V1
O navegador do visitante executa `js/app.js`.
Esse JavaScript consulta `https://graphql.anilist.co` e recebe os dados atuais.
Por isso, não é necessário editar o HTML para mudar a lista de episódios.

Fluxo:
Visitante abre o site -> JavaScript consulta AniList -> AniList devolve os dados -> cards são montados na tela.

## O que entra depois
### V2 — Notícias automáticas
GitHub Actions executará um robô em intervalos definidos:
1. consulta feeds/fontes autorizadas;
2. identifica novidades;
3. atualiza `data/noticias.json`;
4. faz commit no GitHub;
5. Cloudflare Pages publica a nova versão automaticamente.

### V3 — Notificações
Integração com Web Push / OneSignal.

## Teste local
Basta abrir `index.html`. Para uma experiência mais confiável com APIs, prefira um servidor local:
- VS Code + Live Server, ou
- `python -m http.server 8000`

## Hospedagem
A V1 é estática: não precisa de PostgreSQL, Render, Node ou servidor permanente.
