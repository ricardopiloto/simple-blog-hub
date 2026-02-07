# Proposal: Anonimizar documentação para GitHub e manter documentação local específica

## Summary

O projeto é **open-source**: qualquer pessoa pode clonar o repositório e replicar o blog no seu próprio domínio e servidor. A documentação que é **commitada e enviada para o GitHub** não deve conter domínios reais (ex.: 1nodado.com.br) nem caminhos específicos do servidor do mantenedor (ex.: `/var/www/blog`). Esta change define:

1. **Documentação no repositório (GitHub)** — Genérica: sem domínios reais nem caminhos absolutos específicos; uso de placeholders (ex.: `https://seu-dominio.com`, `REPO_DIR`, `DOCUMENT_ROOT`) para que qualquer utilizador possa seguir os guias substituindo pelos seus próprios valores.
2. **Documentação local (não commitada)** — O mantenedor (ou qualquer operador) pode manter uma cópia local dos guias de deploy/atualização com **todos os detalhes específicos** do seu ambiente (domínio, caminhos, nomes de serviços). Esses ficheiros ficam no `.gitignore` e não são enviados para o GitHub.

Assim, quem faz fork ou clone vê apenas documentação reutilizável; quem quiser pode criar localmente a sua versão preenchida com o seu domínio e caminhos.

## Goals

- **Repositório genérico**: Toda a documentação versionada (README, ATUALIZAR-SERVIDOR-DOCKER-CADDY.md, DEPLOY-DOCKER-CADDY.md, READMEs dos backends, specs project-docs) não contém domínios reais nem caminhos específicos do servidor do autor; usa placeholders claros.
- **Open-source friendly**: Qualquer pessoa pode usar o código e a documentação para replicar o blog no seu próprio domínio e servidor, sem referências a 1nodado.com.br ou `/var/www/blog`.
- **Dois níveis de documentação**: (a) No repo: guias genéricos; (b) Local (opcional): guias com domínio e caminhos preenchidos, ignorados pelo git, para uso do operador no seu servidor.

## Scope

- **In scope**: (1) Substituir em **todos os ficheiros commitados** que referenciem domínio 1nodado.com.br (ou blog.1nodado.com.br) por placeholders genéricos (ex.: `seu-dominio.com`, `https://seu-dominio.com`). (2) Substituir caminhos específicos (ex.: `/var/www/blog`, `/var/www/blog/repo`, `/var/www/blog/dist`) por placeholders (ex.: `DOCUMENT_ROOT`, `REPO_DIR`, ou texto como "diretório do projeto (ex.: `/caminho/do/projeto`)" e "document root do Caddy (ex.: `/caminho/do/projeto/dist`)"). (3) Atualizar o spec **project-docs** para exigir que a documentação commitada seja genérica (sem domínios reais nem caminhos específicos) e permitir documentação local ignorada. (4) Definir no `.gitignore` o padrão para documentação local (ex.: `*-local.md` ou ficheiros numa pasta `docs/local/`). (5) Documentar no README (ou num ficheiro curto na raiz) que existe a opção de manter uma cópia local dos guias com dados específicos do servidor e que essa cópia não deve ser commitada.
- **Out of scope**: Alterar código da aplicação; automatizar a geração da documentação local a partir da genérica; alterar o ficheiro DEPLOY-UBUNTU-CADDY.md que já está no `.gitignore` (permanece como documento local por natureza).

## Affected documents (committed → generic)

- **README.md** — Verificar se há menções a domínio ou caminhos; usar placeholders se necessário.
- **ATUALIZAR-SERVIDOR-DOCKER-CADDY.md** — Substituir `blog.1nodado.com.br`, `/var/www/blog`, `/var/www/blog/repo` por placeholders (ex.: `VITE_BFF_URL=https://seu-dominio.com`, "diretório do repositório no servidor (ex.: `REPO_DIR`)", "document root do Caddy (ex.: `DOCUMENT_ROOT`)").
- **DEPLOY-DOCKER-CADDY.md** — Substituir domínio e todos os caminhos `/var/www/blog*` por placeholders; exemplos de Caddyfile com `seu-dominio.com` e variáveis genéricas.
- **backend/api/README.md** — Substituir exemplo `/var/www/blog/repo` por "raiz do repositório no servidor (ex.: `REPO_DIR`)".
- **backend/bff/README.md** — Verificar referências a domínio ou caminhos; manter genérico.
- **openspec/specs/project-docs/spec.md** — Remover exemplos que citem blog.1nodado.com.br ou 1nodado.com.br; usar "e.g. seu-dominio.com" ou similar nos cenários. Adicionar requisito: documentação commitada SHALL usar placeholders; documentação local (ignorada) MAY conter dados específicos.
- **openspec/changes/** — Em changes ativas que incluam exemplos em design.md ou proposal.md com 1nodado ou /var/www/blog, substituir por placeholders (ex.: add-post-cover-image-upload-local/design.md).

## Documentação local (não commitada)

- O mantenedor pode manter, por exemplo, `DEPLOY-DOCKER-CADDY.local.md` ou `docs/local/DEPLOY-DOCKER-CADDY.md` com o domínio real e caminhos reais (`/var/www/blog`, etc.). Esses ficheiros são listados no `.gitignore`.
- Opcional: incluir no repo um ficheiro de exemplo vazio ou template (ex.: `DEPLOY-DOCKER-CADDY.local.example.md`) que explica que se pode copiar o guia genérico e preencher com os seus valores, e guardar como `*.local.md` (ignorado).

## Dependencies and risks

- **Nenhuma dependência** de outras changes. Apenas documentação e convenção de ficheiros ignorados.
- **Risco baixo**: Quem já tem clones do repo continuará a ver a documentação genérica após pull; quem mantém cópia local com dados específicos deve garantir que essa cópia está no `.gitignore` para não ser commitada por engano.

## Success criteria

- Nenhum ficheiro commitado contém a string `1nodado.com.br` ou `blog.1nodado.com.br`.
- Os guias de deploy e atualização no repo usam apenas placeholders para domínio e caminhos (ex.: seu-dominio.com, REPO_DIR, DOCUMENT_ROOT ou texto equivalente).
- O spec project-docs exige documentação genérica e permite documentação local ignorada.
- O `.gitignore` inclui o padrão acordado para documentação local (ex.: `*.local.md` ou `docs/local/`).
- O README (ou doc equivalente) explica em uma ou duas frases que a documentação no repo é genérica e que se pode manter uma cópia local com dados específicos (não commitada).
