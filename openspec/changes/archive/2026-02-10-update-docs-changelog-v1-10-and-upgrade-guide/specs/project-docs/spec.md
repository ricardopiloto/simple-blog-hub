# project-docs — delta for update-docs-changelog-v1-10-and-upgrade-guide

## ADDED Requirements

### Requirement: CHANGELOG [1.10] descreve todas as changes da release (SHALL)

A secção **## [1.10]** do ficheiro **docs/changelog/CHANGELOG.md** **deve** (SHALL) listar e descrever **todas** as changes que integram a release v1.10, com uma entrada por change: add-security-hardening-assessment, add-security-remediation-proposal, add-code-improvements-evaluation, add-changelog-1-10-docs-update, harden-login-credentials-exposure, add-remaining-hardening-improvements-and-db-script-rule, apply-code-improvements, apply-security-hardening. Cada entrada **deve** ter uma descrição breve do que a change introduz (avaliações, documentação, implementações de hardening ou melhorias de código).

#### Scenario: Leitor consulta o CHANGELOG e vê a release 1.10 completa

- **Quando** um utilizador abre docs/changelog/CHANGELOG.md
- **Então** encontra a secção **## [1.10]** com entradas para as oito changes acima
- **E** cada entrada tem descrição suficiente para entender o âmbito da change (avaliação, doc, hardening, melhorias de código)
- **E** a frase introdutória do changelog continua a mencionar v1.10 nas tags de release

#### Scenario: Operador verifica o histórico da release 1.10

- **Quando** um operador ou desenvolvedor consulta o CHANGELOG para saber o que mudou na v1.10
- **Então** vê listadas as changes de avaliação (security hardening, remediation, code improvements), a atualização de docs/changelog, a redução de exposição de credenciais, as melhorias restantes (slug, logging, regra de script BD), as melhorias de código (BFF/API/frontend) e o hardening aplicado (sanitização, CORS, headers, secrets, magic bytes, senha 8 chars, rate limiting, Docker não-root, PRODUCTION-CHECKLIST, etc.)

---

### Requirement: Guia de atualização da versão 1.9 para a 1.10 (SHALL)

**Deve** (SHALL) existir um guia de atualização da **versão 1.9 para a 1.10**, acessível a operadores que já têm o servidor em produção na v1.9. O guia **deve** estar em **docs/deploy/** (ex.: ATUALIZAR-1-9-PARA-1-10.md). O conteúdo **deve** incluir: (a) público-alvo (operadores em v1.9); (b) passos de atualização (pull, reconstruir imagens Docker quando aplicável, build do frontend, atualização de variáveis de ambiente); (c) **variáveis obrigatórias em produção** para a v1.10: Cors:AllowedOrigins (BFF), Jwt:Secret com pelo menos 32 caracteres (BFF), API:InternalKey (BFF e API); (d) avisos: alteração da política de senha (8 caracteres, maiúscula, minúscula, número); falha ao arranque do BFF/API em produção se CORS, Jwt:Secret ou API:InternalKey não estiverem configurados; contentores Docker a correr como utilizador não-root (uid 1000) e permissões no volume de dados se necessário; (e) referências a PRODUCTION-CHECKLIST.md, DEPLOY-DOCKER-CADDY.md e ATUALIZAR-SERVIDOR-DOCKER-CADDY.md; (f) nota de que a v1.10 **não** introduz novas migrações ou scripts SQL obrigatórios para alteração de esquema.

#### Scenario: Operador em v1.9 segue o guia para atualizar para 1.10

- **Quando** um operador com servidor em v1.9 abre o guia de atualização 1.9→1.10
- **Então** encontra os passos (pull, rebuild, build frontend, variáveis de ambiente)
- **E** vê claramente as variáveis obrigatórias em produção (Cors:AllowedOrigins, Jwt:Secret ≥ 32, API:InternalKey)
- **E** é informado da nova política de senha e do comportamento em produção (falha ao arranque sem config)
- **E** tem referências aos documentos de deploy e ao PRODUCTION-CHECKLIST
- **E** sabe que não precisa de executar scripts SQL adicionais para esta atualização

#### Scenario: Leitor confirma que o guia existe em docs/deploy

- **Quando** um utilizador lista ou navega em docs/deploy/
- **Então** encontra um ficheiro dedicado à atualização 1.9→1.10 (ex.: ATUALIZAR-1-9-PARA-1-10.md)
- **E** o README ou a documentação principal pode referenciar este guia para quem atualiza de 1.9 para 1.10
