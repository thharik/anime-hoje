# Anime Hoje — V1.6

## Correção da tradução da sinopse

O problema anterior acontecia porque os detalhes do anime (incluindo a sinopse)
eram inseridos por JavaScript depois que o navegador já havia iniciado a tradução
automática da página. Isso podia fazer o Chrome traduzir a sinopse para português,
mas não restaurá-la corretamente ao voltar para inglês.

Nesta versão, `/anime.html?id=...` é renderizado no Cloudflare Worker.

Fluxo:
1. O visitante abre a página do anime.
2. O Worker busca os dados do catálogo.
3. O Worker monta o HTML completo, já contendo a sinopse.
4. Só então a página chega ao navegador.
5. O Google Chrome consegue traduzir/reverter a página inteira de forma muito mais consistente.

## Idiomas

A página-fonte continua em inglês para que o tradutor nativo do navegador possa
oferecer tradução para o idioma preferido do visitante.

Não existe seletor de idioma dentro do site.

O site depende das línguas suportadas pelo mecanismo de tradução do navegador.
O site não consegue obrigar o Chrome a abrir o pop-up de tradução.

## Títulos dos animes

Os nomes dos animes continuam com:
- `translate="no"`
- `class="notranslate"`

Assim, a interface e a sinopse podem ser traduzidas, mas o título da obra é preservado.

## Cloudflare

Esta versão adiciona:
- `wrangler.jsonc`
- `src/index.js`
- `.assetsignore`

Os arquivos estáticos continuam na raiz para facilitar a atualização do repositório atual.


## V1.6.1 — estabilidade da tradução e do catálogo

### Google Translate / Chrome
O CSP agora permite especificamente os estilos servidos por:
- `https://www.gstatic.com`

Isso corrige o bloqueio observado no console ao usar o tradutor nativo do Chrome,
sem abrir a política para qualquer domínio.

### Página do anime
As páginas de detalhes passam a usar `caches.default` no Cloudflare Worker por 30 minutos.

Na prática:
- primeira abertura do anime: consulta o catálogo e grava no cache;
- recarregar a página: usa o cache;
- alternar/retestar tradução: não precisa consultar novamente o catálogo;
- menos chance de atingir rate limit ou falhas temporárias da API.

O Worker inclui o header `X-Anime-Hoje-Cache: HIT|MISS` para facilitar diagnóstico.

Se a fonte de catálogo estiver temporariamente indisponível e ainda não houver cache,
a página retorna 503 com `Retry-After: 30`, em vez de um 502 genérico.


## V1.6.2 — remoção do botão de atualização
- Removido o botão "Refresh now" da página inicial.
- A programação e os títulos em alta continuam sendo carregados automaticamente ao abrir a página.
- Isso evita que visitantes façam novas consultas repetidas à API manualmente.


## V1.7 — SEO internacional
Páginas indexáveis adicionadas para:
- Português (Brasil)
- Inglês
- Espanhol
- Japonês
- Chinês simplificado (China)
- Coreano

Todas possuem canonical + hreflang recíproco e mantêm nomes de animes com `translate="no"` / `notranslate`.

Rotas:
- /pt/animes-que-estreiam-hoje/
- /en/anime-airing-today/
- /es/animes-que-se-estrenan-hoy/
- /ja/kyou-no-anime/
- /zh-cn/jintian-dongman/
- /ko/oneul-aenime/

O sitemap foi atualizado com essas páginas.
