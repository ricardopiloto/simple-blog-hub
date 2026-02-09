# Design: Indicador de obrigatoriedade no campo História

## Opções de indicador

- **Asterisco no label**: "História *" — convenção comum em formulários; pode ser estilizado em cor de destaque (ex.: `text-destructive` ou cor de acento) para consistência com outros campos obrigatórios se o projeto adoptar esse padrão.
- **Texto explícito**: "História (obrigatório)" — deixa inequívoco sem depender da convenção do asterisco.
- **Híbrido**: Label "História" com um `<span>` ao lado contendo " *" ou "(obrigatório)" em `text-muted-foreground` ou pequeno, para não sobrecarregar visualmente.

## Recomendação

- Adicionar **"(obrigatório)"** ao label, ex.: `História (obrigatório)`, ou um asterisco visível ao lado de "História". A implementação pode escolher o que melhor se alinha com o resto do formulário (Título e Slug não mostram asterisco no label hoje; usar "(obrigatório)" no História torna-o consistente e muito claro).

## Acessibilidade

- O indicador é visual; o estado obrigatório do controlo já é coberto pela validação e mensagem de erro. Opcionalmente, o label pode ser associado a um `aria-required="true"` no ToggleGroup se o componente o suportar, para leitores de ecrã.
