# project-docs — delta for update-docs-and-changelog-for-v2-5-2

## ADDED Requirements

### Requirement: CHANGELOG e versão atualizados para a release v2.5.2 (SHALL)

Para a **release versionada v2.5.2**, o ficheiro **docs/changelog/CHANGELOG.md** **deve** (SHALL) conter a secção **## [2.5.2]** **no topo** (acima de [2.5.1]) que descreve as alterações dessa versão: (1) **notify-session-expired-and-redirect-to-home** — ao receber 401 (sessão expirada ou token inválido), o frontend exibe modal informando que a sessão expirou; quando o utilizador estava na área do autor, ao dispensar o modal é redirecionado para a página inicial (`/`); (2) **move-story-type-error-below-form-buttons** — no formulário Novo post e Editar post, o alerta de História obrigatório foi movido para abaixo dos botões "Criar post"/"Salvar" e "Cancelar"; borda vermelha no toggle da História mantida; (3) item de **documentação e versão** (CHANGELOG [2.5.2], versão no frontend 2.5.2, README secção 4 com tag v2.5.2). O **frontend/package.json** **deve** ter o campo `version` definido como **"2.5.2"**. O **README** (secção 4, Links para CHANGELOG) **deve** incluir **v2.5.2** na lista de exemplos de tags de release.

#### Scenario: Leitor consulta o CHANGELOG para a v2.5.2

- **GIVEN** the release v2.5.2 has been prepared (change update-docs-and-changelog-for-v2-5-2)
- **WHEN** a user opens docs/changelog/CHANGELOG.md
- **THEN** the section **## [2.5.2]** is at the top (above [2.5.1])
- **AND** it lists notify-session-expired-and-redirect-to-home and move-story-type-error-below-form-buttons with brief descriptions
- **AND** it includes the documentation and version item (package.json 2.5.2, README with tag v2.5.2)
