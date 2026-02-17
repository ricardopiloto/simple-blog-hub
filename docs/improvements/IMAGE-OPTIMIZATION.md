# Otimização de imagens (capas de posts)

Este documento descreve uma **análise** de otimização das imagens de capa dos posts, com o objetivo de **reduzir a quantidade de dados** transferidos ao utilizador final e **melhorar o tempo de carregamento**. **Nenhuma alteração de código é aplicada** neste documento; serve como referência para implementação futura em changes OpenSpec.

---

## 1. Estado atual

- **Upload (BFF):** O ficheiro é validado (tipo por Content-Type e magic bytes; máx. 5 MB) e gravado **tal como recebido**, sem compressão nem redimensionamento. Formatos aceites: JPEG, PNG, WebP.
- **Armazenamento:** Um ficheiro por capa em `frontend/public/images/posts/` (ou path configurado), servido em `/images/posts/<id>.<ext>`.
- **Frontend:** Todas as exibições (lista de posts, post único, índice da história, página inicial) usam a mesma URL (`post.cover_image`). Não há `loading="lazy"`, nem `srcset`/`sizes`, nem múltiplas resoluções. O navegador descarrega o ficheiro completo em cada contexto, mesmo quando a imagem é exibida em tamanho pequeno (ex.: card na lista).

**Problema:** Um autor pode enviar uma imagem de 4 MB em resolução alta; todos os visitantes que abrem a lista ou o post transferem esses 4 MB, o que degrada o tempo de carregamento e consome dados desnecessários (especialmente em mobile).

---

## 2. Objetivo

- **Carregar a menor quantidade possível de dados** para o utilizador final.
- **Melhorar o tempo de leitura/carregamento** das imagens (perceção de velocidade e tempo até primeira pintura).

---

## 3. Recomendações (priorizadas)

### 3.1 Compressão e redimensionamento no upload (alta prioridade)

- **No BFF (ou API), após validar o ficheiro:** Redimensionar a imagem para uma **dimensão máxima** (ex.: 2200 px de largura para capas 16:9; default configurável no BFF) e comprimir com **qualidade controlada** (ex.: JPEG qualidade 85%, ou conversão para WebP se preferível). Gravar apenas esta versão “otimizada” em disco.
- **Benefício:** Reduz tamanho armazenado e tamanho servido em todos os contextos; o utilizador nunca recebe um ficheiro de vários MB quando a exibição é limitada (ex.: 400 px de largura no card).
- **Implementação sugerida:** Biblioteca de processamento de imagens em .NET (ex.: **ImageSharp**) no BFF: após magic bytes, abrir a imagem, redimensionar (mantendo proporção), guardar com qualidade definida. Manter nome único (GUID + extensão). Opcional: guardar também uma versão “thumbnail” (ex.: 400 px) para listas e usar essa URL em contextos de card.

### 3.2 Lazy loading no frontend (alta prioridade)

- **Adicionar `loading="lazy"`** nas imagens de capa que estão **abaixo da dobra** (ex.: cards na lista de posts, índice da história). Imagens “above the fold” (ex.: capa do post em destaque na página inicial, capa no topo da página do artigo) podem manter `loading="eager"` (comportamento por defeito).
- **Benefício:** O navegador não descarrega imagens fora do viewport até o utilizador fazer scroll; reduz tempo até conteúdo interativo e dados transferidos na carga inicial.
- **Implementação:** Nos componentes que renderizam capas (PostCard, StoryIndex, lista em Posts), usar `<img loading="lazy" ... />`. Na capa principal do post (PostPage) e no destaque da home (FeaturedPost), pode manter-se sem lazy ou usar lazy apenas em viewports pequenos.

### 3.3 Múltiplas resoluções / srcset (média prioridade)

- **Servir várias versões da mesma capa:** Por exemplo “thumbnail” (400 px), “medium” (800 px), “full” (2200 px). O frontend usa `srcset` e `sizes` para o navegador escolher a resolução adequada ao contexto (card vs. página do post).
- **Benefício:** Em listas, o utilizador recebe apenas a versão pequena; na página do artigo, a versão maior. Requer que o upload produza e armazene várias versões (ou um endpoint que redimensione on-the-fly com cache).
- **Dependência:** Recomendação 3.1 (processamento no upload) pode ser estendida para gerar thumbnail + medium + full numa única change.

### 3.4 Formato WebP para entrega (média prioridade)

- **Servir WebP** quando o navegador suportar (Accept: image/webp), com fallback para JPEG/PNG. Reduz ainda mais o tamanho em muitos casos.
- **Opções:** (1) No upload, guardar também versão WebP e servir conforme Accept; (2) ou converter tudo para WebP no upload e servir um único ficheiro (navegadores atuais suportam WebP). O spec post-cover-display já permite upload de WebP; a recomendação aqui é **preferir** WebP como formato de armazenamento/saída para novas imagens se a ferramenta de processamento o suportar.

### 3.5 Limites de dimensão no cliente (baixa prioridade)

- **No formulário de edição de post:** Opcionalmente, avisar o autor quando a imagem selecionada for muito grande (ex.: > 2 MB ou > 3000 px) antes do upload, sugerindo redimensionar localmente. Não substitui a compressão no servidor; melhora a experiência ao evitar uploads muito longos.

---

## 4. Priorização e dependências

| Ordem | Recomendação | Dependência |
|-------|--------------|-------------|
| 1 | Compressão/redimensionamento no upload | Nenhuma; pode ser implementada primeiro |
| 2 | Lazy loading no frontend | Nenhuma |
| 3 | Múltiplas resoluções (thumbnail, medium, full) | Recomendação 1 (pipeline de processamento no upload) |
| 4 | WebP para entrega | Pode ser incluída na recomendação 1 (guardar como WebP) |
| 5 | Aviso de dimensão no cliente | Opcional |

---

## 5. Referências

- Spec **post-cover-display** (upload, formatos, proporção 16:9): `openspec/specs/post-cover-display/spec.md`.
- Upload atual: `backend/bff/Controllers/UploadsController.cs`.
- Exibição de capas: `frontend/src/components/blog/PostCard.tsx`, `FeaturedPost.tsx`, `frontend/src/pages/PostPage.tsx`, `StoryIndex.tsx`, `Posts.tsx`.
