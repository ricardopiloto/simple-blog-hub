# Design: Reverter next story order para "último publicado + 1"

## Context

A change add-story-order-resilience-and-next-available alterou o cálculo do "próximo" para max(story_order) sobre **todos os posts na história** (IncludeInStoryOrder == true), publicados e rascunho, + 1 — para evitar lacunas (ex.: sugerir 31 após um rascunho com 30). O utilizador pede para **reverter** à regra original: considerar apenas o **último post publicado**.

## Decision: Next = max over published posts + 1

O valor retornado por GET /api/posts/next-story-order SHALL ser:

- **max(story_order)** sobre posts com **Published == true** + 1
- ou **1** se não existir nenhum post publicado

Não considerar rascunhos. Não aplicar filtro adicional por IncludeInStoryOrder (o "último post publicado" é literalmente qualquer post publicado com o maior story_order). Assim: se o último publicado tiver ordem 6, o próximo sugerido é 7.

## Optional: Restringir a "publicados na história"

Se no futuro se quiser que o próximo seja "próxima posição na sequência do Índice" (apenas entre publicados que estão na história), seria max sobre (Published == true **e** IncludeInStoryOrder == true) + 1. Este change **não** aplica esse filtro; usa apenas Published.

## Frontend

O frontend continua a chamar next-story-order e a preencher o campo Ordem. O aviso "Esta ordem está muito à frente da sequência atual" continua a fazer sentido (compara com o novo valor sugerido). Nenhuma alteração obrigatória no frontend além do que a API passar a devolver.
