# project-docs — delta for add-changelog-1-10-docs-update

## ADDED Requirements

### Requirement: CHANGELOG em docs/changelog/ com secção [1.10] (SHALL)

O ficheiro **CHANGELOG.md** **deve** (SHALL) estar em **docs/changelog/CHANGELOG.md**. A frase introdutória **deve** incluir **v1.10** na lista de tags de release (ex.: v1.8, v1.9, v1.10). **Deve** existir a secção **## [1.10]** acima de `## [1.9]` com **uma entrada por change** para cada uma das changes em openspec/changes/ (add-security-hardening-assessment, add-code-improvements-evaluation, add-changelog-1-10-docs-update). A entrada add-changelog-1-10-docs-update descreve a atualização da documentação do projeto: reorganização em docs/, README com referências a CHANGELOG, SECURITY-HARDENING e CODE-IMPROVEMENTS nos caminhos corretos, exemplos de tags, estrutura de pastas com docs/ e openspec/ no local original; existência de docs/README.md com tabela e nota sobre OpenSpec; .gitignore para docs/local/; versão no rodapé (package.json); secção [1.10] contempla todas as changes em openspec/changes/; nova versão no changelog.

#### Scenario: Leitor consulta o CHANGELOG e vê a versão 1.10

- **Quando** um utilizador abre docs/changelog/CHANGELOG.md
- **Então** encontra a secção **## [1.10]** acima de [1.9]
- **E** vê uma entrada por change para add-security-hardening-assessment, add-code-improvements-evaluation e add-changelog-1-10-docs-update
- **E** a entrada add-changelog-1-10-docs-update descreve a atualização da documentação (estrutura docs/, referências, OpenSpec, docs/README.md, que [1.10] contempla todas as changes em openspec/changes/)
- **E** a frase introdutória menciona v1.10 nas tags de release (ex.: v1.8, v1.9, v1.10)

---

### Requirement: README com referências e estrutura de pastas (SHALL)

O **README.md** na raiz **deve** (SHALL): (a) na secção 4 (Links para CHANGELOG) incluir o link para **docs/changelog/CHANGELOG.md** e o exemplo de tags com v1.8, v1.9 e v1.10; (b) na secção 6 (Procedimentos) referenciar **docs/security/SECURITY-HARDENING.md** (avaliação de segurança e plano de hardening) e **docs/improvements/CODE-IMPROVEMENTS.md** (avaliação de melhorias de código); (c) na secção 7 (Estrutura de pastas) mostrar a árvore com **docs/** (changelog, deploy, database, security, improvements, local) e **openspec/** mantido no local original (project.md, AGENTS.md, specs/, changes/).

#### Scenario: Leitor encontra referências e estrutura no README

- **Quando** um utilizador abre o README.md
- **Então** na secção 4 o link do CHANGELOG aponta para docs/changelog/CHANGELOG.md e o exemplo de tags inclui v1.8, v1.9 e v1.10
- **E** na secção 6 existem links para SECURITY-HARDENING (docs/security/) e CODE-IMPROVEMENTS (docs/improvements/)
- **E** na secção 7 a árvore inclui docs/ (changelog, deploy, database, security, improvements, local) e openspec/ no local original

---

### Requirement: docs/README.md com tabela e nota OpenSpec (SHALL)

**Deve** (SHALL) existir o ficheiro **docs/README.md** com uma tabela que descreva a estrutura da pasta docs/ (changelog, deploy, database, security, improvements, local). O documento **deve** incluir uma nota explícita de que os ficheiros OpenSpec (especificações, changes, openspec/AGENTS.md, etc.) permanecem nos **locais originais** (pasta openspec/ na raiz) e não são movidos para docs/.

#### Scenario: Leitor consulta a estrutura de docs/

- **Quando** um utilizador abre docs/README.md
- **Então** vê uma tabela com as pastas de docs/ (changelog, deploy, database, security, improvements, local) e o respetivo conteúdo
- **E** vê a nota de que os ficheiros OpenSpec permanecem em openspec/ (local original)
