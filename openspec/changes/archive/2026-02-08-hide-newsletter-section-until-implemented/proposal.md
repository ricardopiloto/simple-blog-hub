# Proposal: Esconder a secção "Fique por Dentro" até a funcionalidade estar implementada

## Summary

A secção **"Fique por Dentro"** na página inicial (título, texto "Acompanhe as novidades e não perca nenhum artigo.", campo de e-mail e botão "Inscrever") está atualmente visível mas **sem funcionalidade** — o botão não persiste inscrições. Para evitar confusão aos utilizadores, **esconder** esta secção na interface (não a renderizar) até que a funcionalidade de newsletter (inscrição e notificação por e-mail) seja implementada numa change futura (ex.: add-newsletter-subscribe-and-notify). Quando a funcionalidade estiver pronta, a secção será novamente exibida e ligada ao backend.

## Goals

- **Esconder a secção**: Na página inicial (`/`), a secção com classe `py-20` que contém "Fique por dentro", o texto de acompanhamento e o formulário de e-mail/Inscrever **não deve** ser exibida (não renderizar o bloco no frontend).
- **Sem alterar comportamento do resto**: Destaque, Artigos recentes e demais conteúdos da página inicial permanecem iguais.
- **Documentar**: Especificar que a secção "Fique por Dentro" está oculta até a implementação da newsletter; quando a change de newsletter for aplicada, a secção voltará a ser exibida com formulário funcional.

## Scope

- **In scope**: (1) **Frontend** (`frontend/src/pages/Index.tsx`): Deixar de renderizar a secção "Newsletter" (o `<section className="py-20">` com "Fique por dentro", input e botão Inscrever). Pode ser removida do JSX ou envolvida numa condição que a oculta (ex.: `false && (...)` ou comentário). (2) **Spec home-page**: Adicionar requisito (ou nota) de que a secção "Fique por Dentro" não é exibida na página inicial até a funcionalidade de newsletter estar implementada.
- **Out of scope**: Implementar a funcionalidade de newsletter; alterar outras páginas; adicionar feature flag configurável (basta ocultar por código).

## Affected code and docs

- **frontend/src/pages/Index.tsx**: Remover ou ocultar o bloco da secção Newsletter (linhas ~113–141).
- **openspec/changes/hide-newsletter-section-until-implemented/specs/home-page/spec.md**: Delta com requisito ADDED (secção "Fique por Dentro" não exibida até newsletter implementada).

## Dependencies and risks

- Nenhuma dependência. Risco muito baixo: apenas deixar de renderizar um bloco; o código da secção pode ficar comentado ou numa condição para ser reativado quando a change add-newsletter-subscribe-and-notify for aplicada.

## Success criteria

- Na página inicial, a secção "Fique por dentro" (com input e botão Inscrever) **não** é exibida.
- O restante da página inicial (Destaque, Artigos recentes) continua a funcionar normalmente.
- `openspec validate hide-newsletter-section-until-implemented --strict` passa.
