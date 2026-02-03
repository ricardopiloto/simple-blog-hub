# Change: Corrigir/documentar falha do dotnet run na API (porta em uso)

## Why

O `dotnet run` na API pode falhar com "Failed to bind to address http://127.0.0.1:5001: address already in use" quando a porta 5001 está ocupada (outra instância da API, BFF, ou outro processo). O usuário precisa saber como resolver: usar outra porta via variável de ambiente ou liberar a porta.

## What Changes

- **backend/api/README.md**: Na seção **Troubleshooting**, adicionar um item sobre falha do `dotnet run` por porta em uso: explicar que a mensagem "Address already in use" indica que a porta 5001 está ocupada; indicar como rodar em outra porta com `ASPNETCORE_URLS=http://localhost:5002 dotnet run` (e lembrar de ajustar a URL da API no BFF se usar outra porta); opcionalmente como verificar/encerrar o processo que usa a porta (ex.: `lsof -i :5001` no macOS/Linux).
- Nenhuma alteração de código ou configuração obrigatória na API; apenas documentação. Opcional: adicionar em `appsettings.Development.json` um comentário ou exemplo de `urls` para referência.

## Impact

- Affected specs: project-docs (documentação do backend).
- Affected code: `backend/api/README.md`. Build e comportamento do `dotnet run` permanecem iguais; apenas o usuário passa a ter instruções claras quando a porta estiver em uso.
