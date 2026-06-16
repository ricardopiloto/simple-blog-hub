# Backend (1noDado RPG)

Backend em .NET 8 com duas aplicações:

- **api/** — API interna (EF Core + SQLite). Endpoints `GET /api/posts`, `GET /api/posts/{slug}`. Não exposta à internet; ver `api/README.md`.
- **bff/** — BFF (Backend-for-Frontend). Único ponto de entrada público; repassa requisições para a API. Endpoints `GET /bff/posts`, `GET /bff/posts/{slug}`. Ver `bff/README.md`.

Ordem para rodar: primeiro a API (porta 5001), depois o BFF (porta 5000). O frontend consome apenas o BFF.

## Quando `dotnet build` falha (validação)

Os projetos **não têm erro de código** típico: ambos são `net8.0` e restauram pacotes normalmente. As falhas reproduzidas na prática vêm do **ambiente .NET no Fedora** e do ficheiro **`backend/global.json`**.

### 1. `global.json` e versão do SDK

Se a mensagem pedir **8.0.123** (ou outra patch) e listar um SDK instalado **diferente** (ex.: **8.0.419**), a causa é o **`rollForward`**: com `latestPatch` só entram patches **da mesma faixa** (ex.: 8.0.1xx); o SDK **8.0.419** (faixa 8.0.4xx) é rejeitado.

Neste repositório, `backend/global.json` usa **`8.0.100`** + **`rollForward: latestFeature`** para aceitar qualquer SDK 8.0.x recente (incl. Fedora). Não voltes a fixar `8.0.123` com `latestPatch` se o teu sistema tiver só 8.0.4xx.

### 2. Fedora: SDK em `/usr/share/dotnet` e `FrameworkList.xml` em falta

Erro típico:

`Could not find file '.../usr/share/dotnet/packs/Microsoft.NETCore.App.Ref/8.0.xx/data/FrameworkList.xml'`

O SDK procura packs sob **`/usr/share/dotnet`**, mas as pastas **`data`** aí podem estar **vazias**; os ficheiros existem em **`/usr/lib64/dotnet/packs/.../data/`**.

**a)** Liga o SDK ao root do host (se `dotnet --list-sdks` estiver vazio com `DOTNET_ROOT=/usr/lib64/dotnet`):

```bash
sudo ln -sfn /usr/share/dotnet/sdk /usr/lib64/dotnet/sdk
```

**b)** Liga as pastas `data` dos *targeting packs* (ajusta **8.0.25** ao que existir em `ls /usr/share/dotnet/packs/Microsoft.NETCore.App.Ref/`):

```bash
sudo rm -rf /usr/share/dotnet/packs/Microsoft.NETCore.App.Ref/8.0.25/data
sudo ln -sfn /usr/lib64/dotnet/packs/Microsoft.NETCore.App.Ref/8.0.25/data \
  /usr/share/dotnet/packs/Microsoft.NETCore.App.Ref/8.0.25/data

sudo rm -rf /usr/share/dotnet/packs/Microsoft.AspNetCore.App.Ref/8.0.25/data
sudo ln -sfn /usr/lib64/dotnet/packs/Microsoft.AspNetCore.App.Ref/8.0.25/data \
  /usr/share/dotnet/packs/Microsoft.AspNetCore.App.Ref/8.0.25/data
```

Depois: `dotnet build` em `backend/api` e `backend/bff`.

### 3. Outros sistemas

Em Windows, macOS ou instalação **oficial** da Microsoft num único diretório, `dotnet build` costuma funcionar sem estes passos. Se falhar, corre `dotnet --info` e confirma que **SDK** (não só runtime) está instalado.
