# Design: Documentação genérica vs local

## Objetivo

- **Repo (GitHub)**: documentação que qualquer pessoa pode usar para deploy no **seu** domínio e **seu** servidor — sem nomes de domínio reais nem caminhos absolutos do mantenedor.
- **Local**: o operador pode manter uma cópia dos guias com **seus** dados (domínio, caminhos, nomes de serviços); essa cópia não é commitada.

## Convenção de placeholders (documentação no repo)

| Tipo | Placeholder / texto genérico | Exemplo de uso no texto |
|------|-----------------------------|--------------------------|
| Domínio público do blog | `seu-dominio.com` ou `https://seu-dominio.com` | `VITE_BFF_URL=https://seu-dominio.com npm run build` |
| Diretório do repositório no servidor | `REPO_DIR` ou "diretório do projeto (ex.: `/caminho/do/projeto`)" | `cd REPO_DIR` ou "em `REPO_DIR`" |
| Document root do Caddy (estáticos) | `DOCUMENT_ROOT` ou "document root do Caddy (ex.: `/caminho/do/projeto/dist`)" | `cp -r dist DOCUMENT_ROOT` |
| Caminho base no servidor | Evitar `/var/www/blog`; usar "pasta do projeto no servidor" ou variável `REPO_DIR` / `DOCUMENT_ROOT` | "Copiar os estáticos para o document root do Caddy" |

Em exemplos de Caddyfile no repo, usar um bloco genérico, por exemplo:

```caddyfile
seu-dominio.com {
    handle /bff/* { ... }
    handle { root * /caminho/para/estaticos ; ... }
}
```

Com nota: "Substituir `seu-dominio.com` pelo teu domínio e `/caminho/para/estaticos` pelo diretório onde copias o `dist` do frontend."

## Quais ficheiros ficam genéricos (commitados)

- `README.md`
- `ATUALIZAR-SERVIDOR-DOCKER-CADDY.md`
- `DEPLOY-DOCKER-CADDY.md`
- `backend/api/README.md`
- `backend/bff/README.md`
- `openspec/specs/project-docs/spec.md` (e exemplos em specs)
- Qualquer `design.md` ou `proposal.md` em `openspec/changes/` que cite domínio ou caminhos específicos (ex.: add-post-cover-image-upload-local/design.md)

## Documentação local (não commitada)

- **Padrão no .gitignore**: ignorar ficheiros `*-local.md` na raiz e, opcionalmente, a pasta `docs/local/` (ou apenas ficheiros listados explicitamente, ex.: `DEPLOY-DOCKER-CADDY.local.md`).
- **Conteúdo**: cópia dos guias (DEPLOY, ATUALIZAR) com domínio real (ex.: blog.1nodado.com.br) e caminhos reais (ex.: /var/www/blog) preenchidos. O operador cria ou atualiza essa cópia manualmente.
- **Opcional**: ficheiro no repo `DEPLOY-DOCKER-CADDY.local.example.md` (ou secção no README) a explicar: "Podes copiar DEPLOY-DOCKER-CADDY.md para DEPLOY-DOCKER-CADDY.local.md, preencher com o teu domínio e caminhos, e usar localmente; o ficheiro `.local.md` está no .gitignore."

## Nomes de serviços systemd (DEPLOY-UBUNTU-CADDY)

O ficheiro DEPLOY-UBUNTU-CADDY.md já está no `.gitignore` (específico do servidor). Se no futuro existir uma versão genérica no repo (ex.: DEPLOY-UBUNTU-CADDY.md como template), os nomes de serviços devem ser genéricos (ex.: `blog-api.service`, `blog-bff.service`) em vez de `1nodado-api.service`. Para esta change, DEPLOY-UBUNTU-CADDY permanece ignorado; apenas garantimos que os **outros** docs commitados não referenciem domínio ou caminhos específicos.
