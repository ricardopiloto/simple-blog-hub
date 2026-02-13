# Design: Atualização HtmlSanitizer para remediar GHSA-j92c-7v7g-gj3f

## 1. Avaliação do alerta

- **Advisory**: GHSA-j92c-7v7g-gj3f — vulnerabilidade de severidade **moderada** no pacote HtmlSanitizer.
- **Natureza**: Bypass na sanitização relacionado com a tag `<template>`: quando permitida, o conteúdo pode não ser sanitizado, permitindo XSS (mutation XSS ou uso de `shadowrootmode`).
- **Versão afetada no projeto**: **8.1.870** (referenciada em `backend/api/BlogApi.csproj`).
- **Uso no projeto**: `MarkdownService` (API) usa `new HtmlSanitizer()` com configuração padrão e `Sanitize(html)` para limpar o HTML dos posts (Markdown→HTML e pass-through). Objetivo: mitigar XSS na leitura pública.

## 2. Versão alvo

- **Recomendação**: Atualizar para **HtmlSanitizer 9.0.892** (estável no NuGet; não apresenta aviso de vulnerabilidade moderada na página de versões do pacote).
- **Compatibilidade**: O pacote 9.0.892 suporta **net8.0**; o projeto API targeta net8.0, portanto compatível.
- **Namespace e API**: O pacote continua a usar o namespace `Ganss.Xss` e a expor a classe `HtmlSanitizer` com o método `Sanitize(string)`. O uso atual em `MarkdownService` não configura tags/atributos especiais (usa instância padrão), pelo que a migração 8.1 → 9.0 deve ser direta. Se houver alteração menor na API (ex.: assinaturas opcionais), ajustar apenas `MarkdownService.cs`.

## 3. Alternativas consideradas

- **Permanecer em 8.1.870**: Mantém a vulnerabilidade; não aceitável.
- **Usar versão 8.0.723 ou superior na linha 8.0**: Partes da documentação indicam que 8.0.723 inclui correção para uma CVE (template tag); no entanto, o NuGet continua a marcar várias versões 8.x como tendo "moderate severity" vulnerability. A linha 9.0 estável (9.0.892) é a opção mais clara sem aviso de vulnerabilidade.
- **Substituir HtmlSanitizer por outra biblioteca**: Aumenta o âmbito e o risco; o spec de security-hardening já referencia HtmlSanitizer e a implementação está validada. Manter a biblioteca e atualizar a versão é a abordagem mais enxuta.

## 4. Resumo da alteração

| Item | Antes | Depois |
|------|--------|--------|
| Pacote | HtmlSanitizer 8.1.870 | HtmlSanitizer 9.0.892 |
| Ficheiro | backend/api/BlogApi.csproj | Mesmo; atualizar Version |
| Código | MarkdownService.cs (sem alteração esperada) | Ajustar apenas se a API do pacote 9.x o exigir |

Nenhuma alteração na arquitetura nem em contratos da API/BFF; apenas atualização de dependência e validação.
