# Tasks: upgrade-htmlsanitizer-remediate-ghsa-j92c-7v7g-gj3f

Lista ordenada de itens de trabalho.

1. **Atualizar referência ao pacote HtmlSanitizer no projeto da API** — Em `backend/api/BlogApi.csproj`, alterar a versão do pacote HtmlSanitizer de `8.1.870` para `9.0.892` (ou outra versão estável que remedeie GHSA-j92c-7v7g-gj3f conforme NuGet/advisories). Executar `dotnet restore` no diretório da API.
   - [x]

2. **Verificar compilação e compatibilidade** — Compilar o projeto da API (`dotnet build backend/api/BlogApi.csproj`). Se houver breaking changes na API do HtmlSanitizer (namespace, construtor, método Sanitize), ajustar `backend/api/Services/MarkdownService.cs` apenas na medida necessária; o uso atual é `new HtmlSanitizer()` e `Sanitizer.Sanitize(html)`.
   - [x]

3. **Executar testes** — Rodar os testes do backend (se existirem) e quaisquer testes de integração que exercitem o MarkdownService ou a leitura de posts. Confirmar que a sanitização continua a ser aplicada (comportamento esperado inalterado).
   - [x]

4. **Confirmar remediação do alerta** — Verificar que a ferramenta que reportou o alerta (ex.: `dotnet list package --vulnerable`, GitHub Dependabot ou equivalente) deixa de reportar vulnerabilidade para o pacote HtmlSanitizer na versão escolhida.
   - [x]

5. **Validação OpenSpec** — Executar `openspec validate upgrade-htmlsanitizer-remediate-ghsa-j92c-7v7g-gj3f --strict` e corrigir quaisquer falhas de validação.
   - [x]
