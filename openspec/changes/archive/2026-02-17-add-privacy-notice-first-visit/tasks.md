# Tasks: add-privacy-notice-first-visit

## 1. Utilitário de cookie para o aviso

- [x] 1.1 Criar helper (ex.: em `frontend/src/lib/cookies.ts` ou no próprio componente) para: (1) **ler** um cookie com nome fixo (ex.: `privacy_notice_seen`); (2) **gravar** esse cookie com valor que indique que o utilizador aceitou/dispensou o aviso (ex.: `1`), com `max-age` longo (ex.: 365 dias) e `path=/`. A leitura deve indicar se o aviso já foi visto (cookie presente) ou não (cookie ausente).

## 2. Componente de aviso de privacidade

- [x] 2.1 Criar componente (ex.: `PrivacyNoticeBanner.tsx` ou `CookieConsentBanner.tsx`) que: (1) ao montar, verifica se o cookie de “aviso visto” existe; se existir, não renderiza nada (ou renderiza null); (2) se não existir, exibe um banner/barra (ex.: fixa no rodapé ou no topo) com texto breve sobre os dados que recolhemos (ex.: “Utilizamos cookies e dados de navegação para operar o site. Consulte a nossa Política de Privacidade.”) e link para `/privacy`; (3) inclui um botão ou ação “Entendi” / “Aceitar” que, ao ser clicado, grava o cookie e faz o aviso desaparecer (ex.: estado local `setDismissed(true)` e chamada ao helper de escrita do cookie). O componente deve usar o Layout/estilo do site (Tailwind, tema) para consistência visual.

## 3. Integração no Layout (ou App)

- [x] 3.1 Montar o componente de aviso no `Layout` (ex.: após o `<main>` ou antes do `</div>`) ou no `App` de forma que apareça em **todas as páginas** até ser dispensado. Garantir que o aviso não sobreponha conteúdo crítico de forma intrusiva (ex.: barra no rodapé ou canto inferior).

## 4. Spec delta legal-pages

- [x] 4.1 Em `openspec/changes/add-privacy-notice-first-visit/specs/legal-pages/spec.md`, adicionar requisito ADDED: a aplicação SHALL exibir um **aviso de privacidade** (informação sobre os dados recolhidos ao aceder ao site) na **primeira visita** do utilizador (ou quando não existir indicação de que já viu o aviso). A aplicação SHALL usar um **cookie** guardado no navegador para recordar que o utilizador aceitou ou dispensou o aviso; quando esse cookie estiver presente, o aviso SHALL NOT ser exibido novamente. O aviso SHALL incluir um link para a página **Privacidade** (`/privacy`) e uma ação (ex.: botão) para o utilizador aceitar ou dispensar. Adicionar cenário: primeira visita → aviso visível; utilizador aceita → cookie definido; visita seguinte → aviso não exibido.

## 5. Validação

- [x] 5.1 Executar `openspec validate add-privacy-notice-first-visit --strict` e corrigir até passar.
