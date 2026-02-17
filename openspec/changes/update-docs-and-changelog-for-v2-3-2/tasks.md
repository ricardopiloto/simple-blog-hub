# Tasks: update-docs-and-changelog-for-v2-3-2

## 1. Nova secção no CHANGELOG

- [x] 1.1 Em **docs/changelog/CHANGELOG.md**, inserir no topo (acima de `## [2.3.2]`) a secção **## [2.4]** com os seguintes itens (descrição breve por change):
  - **fix-schedule-publish-draft-post-500:** Correção do erro 500 ao agendar a publicação de um post em rascunho. A API usava uma combinação inválida de `DateTimeStyles` em `ParseScheduledPublishAt` (RoundtripKind | AdjustToUniversal), o que lançava exceção; passou a usar apenas `AdjustToUniversal`, remediando o problema.
  - **upgrade-bff-imagesharp-remediate-ghsa-2cmq:** Atualização do pacote **SixLabors.ImageSharp** no BFF de 3.1.5 para **3.1.11**, remediando as vulnerabilidades GHSA-2cmq-823j-5qj8 (alta) e GHSA-rxmq-m78w-7wmc (moderada). O build deixa de mostrar os avisos NU1903 e NU1902.
  - **add-markdown-preview-tab-post-edit:** Aba **Preview** no campo Conteúdo (Markdown) do formulário de Novo post e Editar post; conversão Markdown → HTML no cliente (marked + DOMPurify); área Preview com o mesmo tamanho da área de escrita e barra de rolagem quando o conteúdo é longo.
  - **increase-upload-max-width-to-2200:** Limite máximo de largura das imagens de capa no upload aumentado de 1200 px para **2200 px** (default em `Uploads:MaxWidth` no BFF); documentação de configuração e IMAGE-OPTIMIZATION atualizadas.
  - **Documentação e versão:** CHANGELOG com secção [2.4]; versão no frontend (package.json) definida como 2.4; README secção 4 com tag v2.4.

## 2. Versão no frontend

- [x] 2.1 Em **frontend/package.json**, alterar o campo `version` para `"2.4"`.

## 3. README

- [x] 3.1 Em **README.md**, na secção 4 (Links para CHANGELOG), na frase que lista exemplos de tags de release, incluir **v2.4** (ex.: … `v2.3.2`, `v2.4`).

## 4. Documentação adicional (opcional)

- [x] 4.1 Se **openspec/project.md** ou **docs/README.md** contiverem referência explícita à versão 2.3.2 ou à “última versão”, atualizar para 2.4 onde aplicável.

## 5. Spec delta project-docs

- [x] 5.1 Em **openspec/changes/update-docs-and-changelog-for-v2-3-2/specs/project-docs/spec.md**, adicionar um delta que referencie o requisito existente “CHANGELOG descreve alterações de cada release versionada” e exija que a release **v2.4** tenha secção **## [2.4]** no CHANGELOG com as changes listadas e que a versão no package.json seja 2.4. Cenário: quando um utilizador abre o CHANGELOG, encontra a secção [2.4] no topo com as alterações desta release.

## 6. Validação

- [x] 6.1 Executar `openspec validate update-docs-and-changelog-for-v2-3-2 --strict` e corrigir eventuais falhas.
