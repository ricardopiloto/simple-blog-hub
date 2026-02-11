# Atualizar documentação do projeto e gerar nova versão no changelog

## Why

A documentação do projeto deve refletir o estado atual e servir de fonte única para quem consulta o repositório. É necessário incluir a versão **1.10** no CHANGELOG e descrever **todas** as mudanças de documentação e estrutura realizadas até à data, para que a proposta e o changelog estejam alinhados com a realidade do projeto.

## Contexto — mudanças já realizadas no projeto (até à data)

Esta change **documenta** as seguintes alterações (já aplicadas ou a refletir na doc e no changelog):

1. **Reorganização da documentação em docs/**  
   Toda a documentação que não é o README principal passou para a pasta **docs/**, organizada por tipo: **changelog/** (CHANGELOG.md), **deploy/** (DEPLOY-DOCKER-CADDY, ATUALIZAR-SERVIDOR-DOCKER-CADDY), **database/** (EXPOR-DB-NO-HOST), **security/** (SECURITY-HARDENING.md), **improvements/** (CODE-IMPROVEMENTS.md), **local/** (guias locais, não versionados).

2. **CHANGELOG em docs/changelog/**  
   O histórico de releases está em **docs/changelog/CHANGELOG.md** (não na raiz).

3. **Documentos de avaliação**  
   - **SECURITY-HARDENING.md** em **docs/security/** — avaliação de segurança e plano de hardening (change add-security-hardening-assessment).  
   - **CODE-IMPROVEMENTS.md** em **docs/improvements/** — avaliação de melhorias de código, segurança, simplificação e reaproveitamento (change add-code-improvements-evaluation).

4. **docs/README.md**  
   Ficheiro que descreve a estrutura de **docs/** (tabela por pasta) e inclui a nota de que os **ficheiros OpenSpec** permanecem nos **locais originais** (pasta **openspec/** na raiz) e não são movidos para docs/.

5. **OpenSpec no local original**  
   Toda a especificação OpenSpec (project.md, AGENTS.md, specs/, changes/) permanece em **openspec/** na raiz; não é movida para docs/.

6. **.gitignore**  
   A pasta **docs/local/** está no .gitignore para que guias locais (ex.: atualização por versão) não sejam versionados.

7. **README.md na raiz**  
   - Sete secções: explicação do projeto, stack, requisitos, links para CHANGELOG, funcionalidades, procedimentos (com links para deploy, database, SECURITY-HARDENING, CODE-IMPROVEMENTS), estrutura de pastas.  
   - Secção 4: link para **docs/changelog/CHANGELOG.md** e exemplo de tags (v1.8, v1.9, v1.10).  
   - Secção 6: referências a **docs/security/SECURITY-HARDENING.md** e **docs/improvements/CODE-IMPROVEMENTS.md**.  
   - Secção 7: árvore de pastas com **docs/** (changelog, deploy, database, security, improvements, local) e **openspec/** no local original.  
   - Menção à versão no rodapé do site (campo `version` em frontend/package.json ou VITE_APP_VERSION).

8. **Outras changes já no CHANGELOG (contexto)**  
   - fix-sitemap-xml-declaration-validation (1.9): correção da declaração XML do sitemap para validadores externos.  
   - add-github-link-to-footer-and-docs (1.3): link do GitHub no rodapé.  
   - Demais funcionalidades e correções já registadas nas secções [1.3]–[1.9].

9. **Secção [1.10] contempla todas as changes em openspec/changes/**  
   A secção **## [1.10]** do CHANGELOG **deve** listar, com uma entrada por change, **todas** as changes que ainda estão em `openspec/changes/` (excluindo apenas a pasta archive): **add-security-hardening-assessment**, **add-code-improvements-evaluation**, **add-changelog-1-10-docs-update**. Ordem sugerida: avaliação de segurança, avaliação de melhorias de código, atualização da documentação e changelog.

## What Changes

1. **CHANGELOG (docs/changelog/CHANGELOG.md):** Na frase introdutória, incluir **v1.10** na lista de tags de exemplo. Inserir secção **## [1.10]** acima de `## [1.9]` com **uma entrada por change** para cada uma das changes em openspec/changes/ (add-security-hardening-assessment, add-code-improvements-evaluation, add-changelog-1-10-docs-update). A entrada add-changelog-1-10-docs-update descreve: reorganização em docs/, CHANGELOG em docs/changelog/, README com referências, exemplos de tags v1.8–v1.10, estrutura docs/ e openspec/, docs/README.md, .gitignore para docs/local/, versão no rodapé, e que a secção [1.10] contempla todas as changes em openspec/changes/; nova versão no changelog.

2. **README.md:** Garantir secção 4 (Links para CHANGELOG) com exemplo de tags v1.8, v1.9, v1.10 e link para **docs/changelog/CHANGELOG.md**. Secção 6 (Procedimentos) com referências a [SECURITY-HARDENING](docs/security/SECURITY-HARDENING.md) e [CODE-IMPROVEMENTS](docs/improvements/CODE-IMPROVEMENTS.md). Secção 7 (Estrutura de pastas) com árvore que inclua **docs/** (changelog, deploy, database, security, improvements, local) e **openspec/** no local original (project.md, AGENTS.md, specs/, changes/). Menção à versão no rodapé (package.json / VITE_APP_VERSION) quando aplicável.

3. **docs/README.md:** Tabela da estrutura de docs/ (changelog, deploy, database, security, improvements, local). Nota explícita: os ficheiros OpenSpec permanecem nos locais originais (pasta **openspec/** na raiz) e não são movidos para **docs/**.

4. **Spec project-docs:** Requisitos ADDED que exijam: (a) CHANGELOG em docs/changelog/ com secção [1.10] e frase introdutória com v1.10; (b) README com links para docs/changelog/CHANGELOG.md, docs/security/SECURITY-HARDENING.md, docs/improvements/CODE-IMPROVEMENTS.md e estrutura de pastas com docs/ e openspec/ no local original; (c) docs/README.md com tabela e nota sobre OpenSpec; (d) secção [1.10] que descreva todas as mudanças listadas no Contexto. Cenários verificáveis para cada requisito.

## Goals

- CHANGELOG (docs/changelog/) contém secção [1.10] que descreve a atualização completa da documentação (todas as mudanças do Contexto).
- README referencia CHANGELOG, SECURITY-HARDENING e CODE-IMPROVEMENTS nos caminhos docs/changelog/, docs/security/, docs/improvements/; secção 7 mostra docs/ e openspec/ no local original.
- docs/README.md existe com tabela da estrutura e nota OpenSpec.
- `openspec validate add-changelog-1-10-docs-update --strict` passa.

## Out of scope

- Alterar conteúdo de SECURITY-HARDENING.md, CODE-IMPROVEMENTS.md ou dos guias (DEPLOY, ATUALIZAR, EXPOR-DB).
- Implementar melhorias de segurança ou de código; apenas documentação e changelog.
- Reverter ou alterar a correção do sitemap (1.9) ou o link do GitHub no rodapé (1.3).

## Success criteria

- docs/changelog/CHANGELOG.md tem secção ## [1.10] e frase introdutória com v1.10; a secção [1.10] contém uma entrada por change para todas as changes em openspec/changes/ (add-security-hardening-assessment, add-code-improvements-evaluation, add-changelog-1-10-docs-update).
- README secção 4 aponta para docs/changelog/CHANGELOG.md com tags v1.8–v1.10; secção 6 referencia docs/security/SECURITY-HARDENING.md e docs/improvements/CODE-IMPROVEMENTS.md; secção 7 inclui árvore de docs/ e openspec/.
- docs/README.md existe com tabela da estrutura e nota sobre OpenSpec nos locais originais.
- Validação OpenSpec em modo strict passa.
