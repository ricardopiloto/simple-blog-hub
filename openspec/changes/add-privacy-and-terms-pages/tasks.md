# Tasks: add-privacy-and-terms-pages

Lista ordenada de itens de trabalho.

1. **Adicionar rotas /privacy e /terms** — Em `frontend/src/App.tsx`, importar os novos componentes de página (Privacy, Terms) e adicionar duas rotas: `Route path="/privacy" element={<Privacy />}` e `Route path="/terms" element={<Terms />}`. Colocá-las antes da rota catch-all `path="*"` para que não sejam capturadas pelo NotFound.
   - [x]

2. **Criar página Privacidade** — Criar `frontend/src/pages/Privacy.tsx`. Usar o componente `Layout` e um título principal (ex.: "Política de Privacidade"). Incluir o conteúdo estático em **português do Brasil** conforme a proposta do design: seções para responsável, dados coletados, finalidade, base legal (**LGPD**), cookies, compartilhamento de dados, direitos do usuário (LGPD), retenção, alterações à política e contato. Estruturar com elementos semânticos (ex.: `<h2>` por seção, `<p>` para parágrafos). Garantir que o conteúdo reflete o contexto do blog (contos e aventuras de RPG, leitores e autores, sem venda de dados) e a LGPD.
   - [x]

3. **Criar página Termos de Uso** — Criar `frontend/src/pages/Terms.tsx`. Usar o componente `Layout` e um título principal (ex.: "Termos de Uso"). Incluir o conteúdo estático em **português do Brasil** conforme a proposta do design: aceitação, natureza do serviço (blog de contos e aventuras de RPG), propriedade intelectual (código do repositório sob licença MIT, conteúdo dos posts da responsabilidade dos autores), condutas permitidas e proibidas, área do autor, links externos, limitação de responsabilidade, alterações aos termos, **lei brasileira aplicável e foro no Brasil**, e contato.
   - [x]

4. **Consistência visual e acessibilidade** — Garantir que ambas as páginas usam as mesmas convenções de estilo (classes Tailwind, tipografia) que o resto do site. Incluir um único `<h1>` por página. Se o projeto usar mecanismo para `<title>` (ex.: React Helmet ou document.title em useEffect), definir títulos adequados para "Privacidade" e "Termos de Uso".
   - [x]

5. **Verificação manual e validação** — Navegar para `/privacy` e `/terms` a partir dos links do footer e confirmar que as páginas carregam com conteúdo legível e bem formatado. Executar `openspec validate add-privacy-and-terms-pages --strict` e corrigir eventuais falhas de validação.
   - [x]
