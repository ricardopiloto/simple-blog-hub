# Tasks: hide-newsletter-section-until-implemented

## 1. Ocultar secção no frontend

- [x] 1.1 Em `frontend/src/pages/Index.tsx`, deixar de renderizar a secção "Fique por Dentro" (o `<section className="py-20">` que contém o título "Fique por dentro", o texto e o formulário de e-mail/Inscrever). Remover o bloco do JSX ou envolvê-lo numa condição que o oculta (ex.: `{false && ( ... )}`) para poder reativar quando a newsletter for implementada.

## 2. Spec delta

- [x] 2.1 Preencher `openspec/changes/hide-newsletter-section-until-implemented/specs/home-page/spec.md` com requisito ADDED: a secção "Fique por Dentro" não é exibida na página inicial até a funcionalidade de newsletter estar implementada, com cenário adequado.

## 3. Validação

- [x] 3.1 Executar `openspec validate hide-newsletter-section-until-implemented --strict` e corrigir falhas.
