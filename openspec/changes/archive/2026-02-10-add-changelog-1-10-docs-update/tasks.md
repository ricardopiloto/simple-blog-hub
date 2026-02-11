# Tasks: add-changelog-1-10-docs-update

## 1. CHANGELOG (docs/changelog/)

- [x] 1.1 Na frase introdutória de docs/changelog/CHANGELOG.md, incluir **v1.10** na lista de tags de exemplo (ex.: v1.8, v1.9, v1.10).
- [x] 1.2 Inserir secção **## [1.10]** acima de `## [1.9]` com uma entrada por change para cada change em openspec/changes/ (add-security-hardening-assessment, add-code-improvements-evaluation, add-changelog-1-10-docs-update). A entrada add-changelog-1-10-docs-update descreve: reorganização em docs/; CHANGELOG em docs/changelog/; README com referências; exemplos de tags v1.8–v1.10; estrutura docs/ e openspec/; docs/README.md; .gitignore para docs/local/; versão no rodapé; [1.10] contempla todas as changes em openspec/changes/; nova versão no changelog.

## 2. README

- [x] 2.1 Secção 4 (Links para CHANGELOG): exemplo de tags v1.8, v1.9, v1.10 e link para docs/changelog/CHANGELOG.md.
- [x] 2.2 Secção 6 (Procedimentos): referências a [SECURITY-HARDENING](docs/security/SECURITY-HARDENING.md) e [CODE-IMPROVEMENTS](docs/improvements/CODE-IMPROVEMENTS.md).
- [x] 2.3 Secção 7 (Estrutura de pastas): árvore com docs/ (changelog, deploy, database, security, improvements, local) e openspec/ no local original (project.md, AGENTS.md, specs/, changes/).

## 3. docs/README.md

- [x] 3.1 Garantir existência de docs/README.md com tabela da estrutura (changelog, deploy, database, security, improvements, local) e nota de que os ficheiros OpenSpec permanecem nos locais originais (openspec/ na raiz).

## 4. Spec delta project-docs

- [x] 4.1 Em `openspec/changes/add-changelog-1-10-docs-update/specs/project-docs/spec.md`, ADDED requirements: (a) CHANGELOG em docs/changelog/ com secção [1.10] e frase introdutória com v1.10; (b) README com links para docs/changelog/CHANGELOG.md, docs/security/SECURITY-HARDENING.md, docs/improvements/CODE-IMPROVEMENTS.md e estrutura com docs/ e openspec/; (c) docs/README.md com tabela e nota OpenSpec; (d) secção [1.10] descrevendo todas as mudanças. Pelo menos um `#### Scenario:` por requisito.

## 5. Validação

- [x] 5.1 Executar `openspec validate add-changelog-1-10-docs-update --strict` e corrigir falhas até passar.
