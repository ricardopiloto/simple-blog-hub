# project-docs — delta for add-version-1-4-and-update-docs

## ADDED Requirements

### Requirement: CHANGELOG descreve alterações de cada release versionada

Para cada **release versionada** do projeto (tag de versão, ex.: v1.3, v1.4), o ficheiro **CHANGELOG.md** na raiz **deve** (SHALL) conter uma secção correspondente (ex.: `## [1.4]`) que descreva as **alterações** dessa versão: (a) lista das changes OpenSpec incluídas na release, com descrição breve de cada uma; (b) quando aplicável, menção à atualização da documentação do projeto e dos procedimentos de atualização/instalação. O objetivo é que qualquer leitor saiba o que foi alterado em cada versão sem depender apenas da mensagem do commit ou da tag.

#### Scenario: Leitor consulta o CHANGELOG para a versão mais recente

- **Quando** um utilizador abre o CHANGELOG.md (ex.: no repositório ou após clone)
- **Então** encontra uma secção para a versão mais recente (ex.: `## [1.4]`)
- **E** essa secção lista as alterações incluídas (changes aplicadas e, se for o caso, atualização da documentação e dos procedimentos)
- **E** pode usar essa informação para saber o que mudou desde a versão anterior
