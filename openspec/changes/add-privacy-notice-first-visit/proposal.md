# Proposal: Aviso de privacidade na primeira visita (cookie de preferência)

## Summary

O site **deve** exibir um **aviso** (banner ou barra) que informa o utilizador sobre os **dados que recolhemos** ao aceder ao site (em linha com a página [Política de Privacidade](/privacy)). O aviso **deve** ser mostrado na **primeira visita** (ou quando o utilizador ainda não tiver registado que o viu). Para saber se é a primeira vez do utilizador, o sistema **utiliza um cookie** guardado no navegador: quando o utilizador aceita ou dispensa o aviso, o site grava um cookie (ex.: `privacy_notice_seen`) para não voltar a mostrar o aviso em visitas seguintes. Assim cumprimos a transparência perante o utilizador e a LGPD, sem repetir o aviso em cada sessão.

## Why

- **Transparência:** O utilizador deve ser informado de forma clara sobre a recolha e o uso de dados ao aceder ao site; um aviso visível na primeira visita reforça a conformidade com a LGPD e a boa prática.
- **Experiência:** Evitar mostrar o aviso em todas as páginas ou em todas as sessões; usar um **cookie** (dado guardado no navegador) permite saber se o utilizador já viu/aceitou o aviso e, nesse caso, não o exibir de novo.

## What Changes

- **Frontend:** Novo componente de **aviso de privacidade** (banner ou barra fixa, ex.: no rodapé ou no topo da página) com: (1) texto breve sobre os dados que recolhemos (ex.: navegação, cookies técnicos, preferências; link para a página **Privacidade**); (2) botão ou ação para o utilizador **aceitar** ou **dispensar** o aviso. Ao aceitar/dispensar, o frontend **grava um cookie** (ex.: `privacy_notice_seen=1`, `max-age` longo, ex.: 1 ano) no domínio do site. Em cada carregamento, o componente **lê** esse cookie; se existir, o aviso **não** é exibido. Se não existir (primeira visita ou cookie expirado/apagado), o aviso é exibido.
- **Integração:** O aviso é montado numa posição visível em todas as páginas (ex.: dentro do `Layout` ou no `App`), de forma a aparecer em qualquer rota até ser dispensado.
- **Spec legal-pages:** Requisito ADDED (ou MODIFIED) que o aplicativo SHALL exibir um aviso de privacidade/recolha de dados na primeira visita (ou quando o utilizador não tiver indicado que o viu) e SHALL usar um cookie para recordar que o utilizador aceitou/dispensou o aviso, de modo a não o exibir novamente em visitas seguintes.

## Goals

- O utilizador vê um aviso claro sobre os dados recolhidos ao aceder ao site, com link para a Política de Privacidade.
- O aviso aparece apenas quando o cookie de preferência **não** está presente (primeira visita ou após limpeza de cookies).
- Após aceitar/dispensar, o cookie é definido e o aviso não volta a ser exibido até que o cookie expire ou seja removido.
- Comportamento alinhado à LGPD (informação e transparência) e à utilização de cookies para preferências do utilizador.

## Scope

- **In scope:** (1) Componente de aviso (texto, link para /privacy, botão aceitar/dispensar). (2) Leitura e escrita de um cookie no navegador para persistir a escolha. (3) Integração no Layout (ou App) para exibir o aviso em todas as páginas quando aplicável. (4) Spec legal-pages com requisito e cenário.
- **Out of scope:** Consentimento granular por categoria de cookies (apenas um aviso único “aceitar”); alteração do conteúdo da página Privacidade (já existe); backend para guardar preferências (apenas cookie no cliente).

## Affected code and docs

- **frontend/src/components/** — novo componente (ex.: `PrivacyNoticeBanner.tsx` ou `CookieConsentBanner.tsx`).
- **frontend/src/components/layout/Layout.tsx** (ou **App.tsx**) — montar o componente de aviso para que apareça em todas as rotas.
- **frontend/src/** — utilitário ou constante para o nome do cookie e leitura/escrita (ex.: `document.cookie` ou helper).
- **openspec/changes/add-privacy-notice-first-visit/specs/legal-pages/spec.md** — delta ADDED com requisito e cenário.

## Success criteria

- Na primeira visita (sem cookie), o utilizador vê o aviso com texto sobre recolha de dados e link para /privacy; ao clicar em aceitar/dispensar, o aviso desaparece e um cookie é definido.
- Em visitas seguintes (com cookie presente), o aviso não é exibido.
- `openspec validate add-privacy-notice-first-visit --strict` passa.
