# project-docs — delta for update-docs-and-changelog-for-v2-3-2

## MODIFIED Requirements

### Requirement: CHANGELOG descreve alterações de cada release versionada (incl. v2.4)

Para cada **release versionada** do projeto (tag de versão, ex.: v1.3, v1.4, v2.4), o ficheiro **CHANGELOG.md** em **docs/changelog/** **deve** (SHALL) conter uma secção correspondente (ex.: `## [2.4]`) que descreva as **alterações** dessa versão: (a) lista das changes OpenSpec incluídas na release, com descrição breve de cada uma; (b) quando aplicável, menção à atualização da documentação do projeto e dos procedimentos de atualização/instalação. O objetivo é que qualquer leitor saiba o que foi alterado em cada versão sem depender apenas da mensagem do commit ou da tag.

Para a **release v2.4**, a secção **## [2.4]** **deve** aparecer **no topo** do CHANGELOG (acima de [2.3.2]) e **deve** listar as changes: fix-schedule-publish-draft-post-500, upgrade-bff-imagesharp-remediate-ghsa-2cmq, add-markdown-preview-tab-post-edit, increase-upload-max-width-to-2200, e o item de documentação e versão (versão no frontend 2.4; README secção 4 com tag v2.4).

#### Scenario: Leitor consulta o CHANGELOG para a versão mais recente

- **Quando** um utilizador abre o CHANGELOG.md (ex.: docs/changelog/CHANGELOG.md no repositório ou após clone)
- **Então** encontra uma secção para a versão mais recente (ex.: `## [2.4]`)
- **E** essa secção lista as alterações incluídas (changes aplicadas e, se for o caso, atualização da documentação e dos procedimentos)
- **E** pode usar essa informação para saber o que mudou desde a versão anterior

#### Scenario: Release v2.4 documentada no CHANGELOG

- **Dado** que a release v2.4 foi preparada (change update-docs-and-changelog-for-v2-3-2)
- **Quando** um utilizador abre docs/changelog/CHANGELOG.md
- **Então** a secção **## [2.4]** está no topo (acima de [2.3.2])
- **E** lista fix-schedule-publish-draft-post-500, upgrade-bff-imagesharp-remediate-ghsa-2cmq, add-markdown-preview-tab-post-edit, increase-upload-max-width-to-2200 com descrição breve
- **E** inclui o item de documentação e versão (package.json 2.4, README com tag v2.4)
