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
