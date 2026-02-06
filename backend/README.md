# Backend (1noDado RPG)

Backend em .NET 9 com duas aplicações:

- **api/** — API interna (EF Core + SQLite). Endpoints `GET /api/posts`, `GET /api/posts/{slug}`. Não exposta à internet; ver `api/README.md`.
- **bff/** — BFF (Backend-for-Frontend). Único ponto de entrada público; repassa requisições para a API. Endpoints `GET /bff/posts`, `GET /bff/posts/{slug}`. Ver `bff/README.md`.

Ordem para rodar: primeiro a API (porta 5001), depois o BFF (porta 5000). O frontend consome apenas o BFF.
