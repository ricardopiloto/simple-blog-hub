# Tasks: fix-dotnet-run-api

## 1. Documentação

- [x] 1.1 Em `backend/api/README.md`, na seção **Troubleshooting**, adicionar um item "Se `dotnet run` falhar com 'Address already in use'": explicar que a porta 5001 está em uso; indicar que é possível rodar em outra porta com `ASPNETCORE_URLS=http://localhost:5002 dotnet run` (e que o BFF deve ser configurado com a mesma URL, ex.: `API__BaseUrl=http://localhost:5002`, se usar outra porta); opcionalmente mencionar como verificar qual processo usa a porta (ex.: no macOS/Linux `lsof -i :5001`) e encerrá-lo se for outra instância da API.

## 2. Validação

- [x] 2.1 Confirmar que a documentação está clara e que `dotnet run` continua funcionando quando a porta 5001 está livre (ou com `ASPNETCORE_URLS` apontando para porta livre).
