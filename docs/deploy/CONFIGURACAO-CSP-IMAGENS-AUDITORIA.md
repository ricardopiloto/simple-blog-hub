# Configuração: CSP, processamento de imagens e auditoria de dependências

Este documento descreve o **passado para as novas configurações** introduzidas pela implementação das recomendações de segurança, código e imagens (change **apply-security-code-and-image-optimization**). Podes copiar trechos para `docs/local/` para manter valores específicos do teu servidor (docs/local está no .gitignore).

---

## 1. Content-Security-Policy (CSP)

O BFF pode enviar o header **Content-Security-Policy** (ou **Content-Security-Policy-Report-Only**) quando configurado. Se não configurares nada, o header não é enviado.

### Chaves de configuração

| Chave | Descrição | Exemplo |
|-------|-----------|---------|
| **Security:CspHeader** | Valor do header CSP. Se vazio ou ausente, o BFF não adiciona o header. | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'` |
| **Security:CspReportOnly** | Se `true`, o header é enviado como `Content-Security-Policy-Report-Only` (só reporta violações, não bloqueia). Útil para testar antes de ativar. | `true` ou `false` |

### Variáveis de ambiente (Docker / servidor)

- `Security__CspHeader` — valor do CSP (escapar aspas conforme o teu ambiente).
- `Security__CspReportOnly` — `true` ou `false`.

### Exemplo de política mínima

Para uma SPA servida no mesmo origin (Vite build estático), uma política conservadora pode ser:

```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```

Tailwind/shadcn podem usar estilos inline; daí `'unsafe-inline'` em `style-src`. Se no futuro usares scripts inline ou CDN, ajusta as diretivas (ex.: `script-src 'self' https://cdn.exemplo.com`).

### Recomendação

1. Ativar primeiro em **Report-Only** (`Security:CspReportOnly=true`) e verificar no browser (consola ou relatórios) se há violações.
2. Corrigir ou relaxar as diretivas conforme necessário.
3. Quando estável, desativar Report-Only (remover ou `Security:CspReportOnly=false`) para que o CSP seja aplicado.

---

## 2. Processamento de imagens no upload

Após a validação por magic bytes, o BFF **redimensiona** e **comprime** a imagem de capa antes de gravar. Assim o utilizador final recebe ficheiros menores.

### Chaves de configuração

| Chave | Descrição | Default |
|-------|-----------|---------|
| **Uploads:MaxWidth** | Largura máxima (px) da imagem após redimensionamento (proporção mantida). | 2200 |
| **Uploads:JpegQuality** | Qualidade JPEG (1–100). Usado para JPEG; PNG/WebP usam compressão equivalente. | 85 |

### Variáveis de ambiente (BFF)

- `Uploads__MaxWidth` — número (ex.: 2200).
- `Uploads__JpegQuality` — número (ex.: 85).

### Comportamento

- **Antes:** O ficheiro era gravado tal como enviado (até 5 MB).
- **Depois:** O ficheiro é redimensionado (largura máxima configurada), comprimido com a qualidade definida e gravado no mesmo path (GUID + extensão). Imagens já pequenas não são ampliadas.

A pasta de gravação continua a ser a configurada em **Uploads:ImagesPath** (ou o default `frontend/public/images/posts`).

---

## 3. Auditoria de dependências

Para verificar vulnerabilidades em pacotes:

- **Backend (API e BFF):** Em `backend/api` e `backend/bff`, executar:
  ```bash
  dotnet list package --vulnerable
  ```
  Corrigir pacotes com vulnerabilidades em changes dedicadas (atualizar versão ou substituir).

- **Frontend:** Em `frontend/`, executar:
  ```bash
  npm audit
  ```
  Tratar advisories conforme a política do projeto (ex.: `npm audit fix` quando seguro).

Para mais contexto e priorização, ver [SECURITY-ASSESSMENT-FOLLOW-UP.md](../security/SECURITY-ASSESSMENT-FOLLOW-UP.md), [CODE-OPTIMIZATION-RECOMMENDATIONS.md](../improvements/CODE-OPTIMIZATION-RECOMMENDATIONS.md) e [IMAGE-OPTIMIZATION.md](../improvements/IMAGE-OPTIMIZATION.md).
