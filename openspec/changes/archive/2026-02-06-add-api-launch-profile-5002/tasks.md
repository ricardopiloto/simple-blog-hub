# Tasks: add-api-launch-profile-5002

## 1. Perfil de launch

- [x] 1.1 Em `backend/api/Properties/launchSettings.json`, adicionar o perfil `http-5002` com `applicationUrl`: `http://localhost:5002`, mantendo as mesmas opções do perfil `http` (commandName, dotnetRunMessages, launchBrowser, launchUrl, environmentVariables).

## 2. Documentação

- [x] 2.1 Em `backend/api/README.md`, no item de Troubleshooting sobre "Address already in use", incluir a opção: rodar com `dotnet run --launch-profile http-5002` e configurar o BFF com `API__BaseUrl=http://localhost:5002` (ou a URL correspondente).

## 3. Validação

- [x] 3.1 Com a porta 5001 livre, `dotnet run` (perfil padrão) continua funcionando; com 5001 em uso, `dotnet run --launch-profile http-5002` sobe a API em 5002.
