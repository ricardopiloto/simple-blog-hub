# Proposal: Corrigir vulnerabilidades SixLabors.ImageSharp no BFF (GHSA-2cmq-823j-5qj8 e GHSA-rxmq-m78w-7wmc)

## Summary

O projeto **BFF** referencia o pacote **SixLabors.ImageSharp**. Após a atualização para **3.1.7** (que remedia a vulnerabilidade de alta severidade **GHSA-2cmq-823j-5qj8**), o build passou a mostrar o aviso **NU1902**: "Package 'SixLabors.ImageSharp' 3.1.7 has a known moderate severity vulnerability" — **GHSA-rxmq-m78w-7wmc** (https://github.com/advisories/GHSA-rxmq-m78w-7wmc). Esta é uma vulnerabilidade **moderada** (Infinite Loop no descodificador GIF ao processar comment extension blocks mal formados; negação de serviço). As versões **corrigidas** para este advisory são **3.1.11** (ramo v3) ou 2.1.11 (ramo v2). Este change atualiza a proposta para **3.1.11**, remediando **ambos** os advisories (GHSA-2cmq-823j-5qj8 e GHSA-rxmq-m78w-7wmc) e eliminando os avisos NU1903 e NU1902.

## Why

- **Problema:** Com ImageSharp 3.1.7, o `dotnet build` ainda emite NU1902 (moderate: GHSA-rxmq-m78w-7wmc). É necessário usar uma versão que remedia também este advisory.
- **Objetivo:** Manter as dependências do BFF sem vulnerabilidades conhecidas de alta ou moderada severidade reportadas pelo NuGet (NU1903/NU1902); usar versão **3.1.11** ou superior na linha 3.x.

## What Changes

- **backend/bff/BlogBff.csproj:** Referência ao pacote `SixLabors.ImageSharp` atualizada para **3.1.11** (remedia GHSA-2cmq-823j-5qj8 e GHSA-rxmq-m78w-7wmc).
- **Validação:** Executar `dotnet restore` e `dotnet build` no BFF; confirmar que **nenhum** aviso NU1903 ou NU1902 aparece para ImageSharp; confirmar que o upload de imagens (UploadsController) continua a funcionar.
- **Spec:** Delta em security-hardening a exigir versão que remedia ambos os advisories (mínimo 3.1.11 na linha 3.x).

## Goals

- O BFF **NÃO** deve reportar avisos NU1903 nem NU1902 para o pacote SixLabors.ImageSharp após o build.
- A versão do ImageSharp no BFF **DEVE** remediar GHSA-2cmq-823j-5qj8 (alta) e GHSA-rxmq-m78w-7wmc (moderada) — versão mínima **3.1.11** na linha 3.x.
- O comportamento do UploadsController (redimensionamento e compressão de imagens) **DEVE** manter-se inalterado.

## Scope

- **In scope:** Atualizar a versão do SixLabors.ImageSharp no BlogBff.csproj para **3.1.11**; validar build (sem NU1903/NU1902) e funcionalidade de upload.
- **Out of scope:** Alterar a lógica de processamento de imagens; adicionar suporte a GIF; alterar a API ou outros projetos.

## Affected code and docs

- **backend/bff/BlogBff.csproj** — versão do PackageReference SixLabors.ImageSharp: 3.1.5 → 3.1.11 (remedia GHSA-2cmq-823j-5qj8 e GHSA-rxmq-m78w-7wmc).
- **openspec/changes/upgrade-bff-imagesharp-remediate-ghsa-2cmq/specs/security-hardening/spec.md** — delta ADDED: requisito de que o BFF use ImageSharp numa versão que remedeie GHSA-2cmq-823j-5qj8 e GHSA-rxmq-m78w-7wmc (mínimo 3.1.11).

## Dependencies and risks

- **Nenhum.** 3.1.11 é um patch release na mesma linha 3.x; a API usada no UploadsController permanece compatível.
- **Risco baixo:** Após o upgrade, ambas as vulnerabilidades (alta e moderada) ficam remediadas.

## Success criteria

- `dotnet build` no diretório `backend/bff` **não** mostra aviso NU1903 nem NU1902 para SixLabors.ImageSharp.
- O pacote SixLabors.ImageSharp no BFF está na versão **3.1.11** (ou superior na 3.x).
- O upload de imagens de capa (JPEG/PNG/WebP) no BFF continua a funcionar como antes.
- `openspec validate upgrade-bff-imagesharp-remediate-ghsa-2cmq --strict` passa.
