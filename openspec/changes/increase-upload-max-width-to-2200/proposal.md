# Proposal: Aumentar o limite máximo de largura de imagem no upload para 2200 px

## Summary

Aumentar o **limite máximo de largura** das imagens de capa no upload (BFF) de **1200 px** para **2200 px**. Atualmente a configuração `Uploads:MaxWidth` tem valor default 1200 no appsettings e no código do UploadsController; a change **apply-security-code-and-image-optimization** (que implementou o redimensionamento com ImageSharp) e as avaliações em **add-security-code-and-image-optimization-assessments** referenciam 1200 px como dimensão máxima. Este change altera o **default** para **2200 px** (configuração e código) e atualiza a documentação para refletir o novo valor, permitindo capas com maior resolução quando necessário (ex.: monitores de alta resolução ou proporções 16:9 com mais detalhe).

## Why

- **Necessidade:** Autores ou operadores podem precisar de capas com maior resolução (ex.: 2200×1238 px em 16:9) para exibição nítida em ecrãs grandes ou para manter qualidade em zoom; o limite de 1200 px pode ser insuficiente.
- **Objetivo:** Aumentar o valor **por defeito** de `Uploads:MaxWidth` para **2200** no BFF, mantendo a configuração opcional (o operador pode continuar a definir um valor menor por variável de ambiente ou appsettings).

## What Changes

- **backend/bff/appsettings.json:** Alterar `Uploads:MaxWidth` de `1200` para `2200`.
- **backend/bff/Controllers/UploadsController.cs:** Alterar o valor default do segundo argumento de `GetValue("Uploads:MaxWidth", 1200)` para `2200`.
- **docs/deploy/CONFIGURACAO-CSP-IMAGENS-AUDITORIA.md:** Na tabela de chaves e na secção de variáveis de ambiente, indicar o default e o exemplo como **2200** em vez de 1200.
- **docs/improvements/IMAGE-OPTIMIZATION.md (opcional):** Se mencionar 1200 px como dimensão máxima recomendada, atualizar para 2200 (ou referir que o default no BFF é configurável e está definido como 2200).
- **Spec:** Delta em post-cover-display (ou project-docs) a indicar que o default de Uploads:MaxWidth é 2200 px (ou que a largura máxima configurável tem default 2200).

## Goals

- O BFF, **por defeito** (sem override por configuração), redimensiona imagens de capa para uma largura máxima de **2200 px** (proporção mantida).
- A documentação (CONFIGURACAO-CSP-IMAGENS-AUDITORIA, e IMAGE-OPTIMIZATION quando aplicável) reflete o novo default.
- Operadores que queiram manter 1200 px podem fazê-lo via `Uploads__MaxWidth=1200` (env) ou `Uploads:MaxWidth` em appsettings.

## Scope

- **In scope:** Alterar default de MaxWidth para 2200 no appsettings do BFF, no código do UploadsController e na documentação de configuração (e, se relevante, em IMAGE-OPTIMIZATION.md).
- **Out of scope:** Alterar qualidade JPEG/PNG/WebP; adicionar múltiplas resoluções (thumbnail, medium, full); alterar o frontend ou a API.

## Affected code and docs

- **backend/bff/appsettings.json** — `Uploads:MaxWidth`: 1200 → 2200.
- **backend/bff/Controllers/UploadsController.cs** — default em `GetValue("Uploads:MaxWidth", …)`: 1200 → 2200.
- **docs/deploy/CONFIGURACAO-CSP-IMAGENS-AUDITORIA.md** — tabela e exemplo de variável de ambiente: default 2200.
- **docs/improvements/IMAGE-OPTIMIZATION.md** — se referir 1200 px como máximo, atualizar para 2200.
- **openspec/changes/increase-upload-max-width-to-2200/specs/post-cover-display/spec.md** — delta que indica default 2200 px para MaxWidth.

## Dependencies and risks

- **Nenhuma dependência.** A change apply-security-code-and-image-optimization já implementou o redimensionamento; apenas se altera o valor default.
- **Risco:** Ficheiros de capa podem ficar maiores (mais bytes por imagem); 2200 px em 16:9 com JPEG qualidade 85 continua razoável para uso web. Operadores com restrições de armazenamento ou banda podem definir MaxWidth menor.

## Success criteria

- Após deploy, um upload de imagem de capa com largura > 2200 px é redimensionado para largura máxima 2200 px (proporção mantida).
- O appsettings do BFF e a documentação indicam default **2200** para Uploads:MaxWidth.
- `openspec validate increase-upload-max-width-to-2200 --strict` passa.
