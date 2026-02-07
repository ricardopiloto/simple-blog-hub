# Design: Versão 1.4 e atualização da documentação

## Contexto

A versão 1.3 foi marcada com uma change que atualizou a documentação e introduziu o CHANGELOG e o guia de atualização (local vs Docker). Desde então foram aplicadas (ou estão previstas) as changes **add-dynamic-sitemap-and-robots** (sitemap e robots.txt pelo BFF; Caddy encaminha /sitemap.xml e /robots.txt) e **expose-db-on-host-for-docker** (bind mount para pasta data/, base no host). O utilizador pede uma proposta para **atualizar a documentação e os procedimentos de atualização/instalação** e marcar esta release como **versão 1.4**, documentando no CHANGELOG o que está a ser alterado.

## Decisão: conteúdo da secção [1.4] no CHANGELOG

- Incluir **add-dynamic-sitemap-and-robots**: Sitemap dinâmico e robots.txt servidos pelo BFF; Caddy encaminha /sitemap.xml e /robots.txt para o BFF.
- Incluir **expose-db-on-host-for-docker** apenas se a change tiver sido aplicada antes ou nesta release (bind mount ./data, EXPOR-DB-NO-HOST.md, documentação local em docs/local/). Se não estiver aplicada, a entrada [1.4] não a menciona ou refere como "opcional/futura" conforme o estado do repo.
- Incluir **add-version-1-4-and-update-docs**: Documentação do projeto e procedimentos de atualização/instalação atualizados para v1.4.
- Formato igual ao [1.3]: linhas por change com breve descrição; última linha sobre a atualização da documentação.

## Decisão: âmbito da revisão da documentação

- **Revisão pontual**, não reescrita completa: verificar que README, DEPLOY e ATUALIZAR mencionam sitemap/robots (já coberto pela change add-dynamic-sitemap-and-robots nos guias Caddy). Se expose-db-on-host tiver sido aplicada, verificar referências a data/ e EXPOR-DB-NO-HOST.md.
- **Procedimentos**: Garantir que os passos de "Atualização Docker" e "Instalação" estão corretos (ordem dos handles no Caddy, migrações, scripts de banco) e que há ligação clara entre DEPLOY e ATUALIZAR.
- **project.md**: Adicionar uma linha no Domain Context ou em External Dependencies sobre sitemap/robots (BFF serve /sitemap.xml e /robots.txt; Caddy deve encaminhar) se ainda não existir.

## Decisão: spec delta

- Um requisito em project-docs que exija que cada **release versionada** (tag vX.Y) tenha uma entrada correspondente no **CHANGELOG.md** descrevendo as alterações dessa versão (lista de changes e, quando aplicável, atualização da documentação). Isso pode ser ADDED como novo requisito com um cenário: "Quando um release é marcado com uma versão (ex.: v1.4), o CHANGELOG contém a secção [1.4] com as alterações incluídas."
