# Tasks: remove-lovable-branding

## 1. UI e metadados (ícone e marca Lovable)

- [x] 1.1 Em `index.html`, substituir título, meta description, author e tags og/twitter (title, description, image, site) por valores do Simple Blog Hub; remover referências e imagens do Lovable.
- [x] 1.2 Em `vite.config.ts`, remover o import de `componentTagger` de `lovable-tagger` e remover o plugin da lista de plugins (para que o ícone/badge do Lovable não apareça na página).
- [x] 1.3 Em `package.json`, remover a dependência `lovable-tagger` de devDependencies e rodar `npm install`.

## 2. Documentação

- [x] 2.1 Em `README.md`, remover a seção "Deploy (opcional)" que descreve publicação e domínio via Lovable e edição no Lovable; adicionar uma única frase creditando o Lovable como ferramenta de criação (ex.: no final do README ou em seção "Sobre").
- [x] 2.2 Em `openspec/project.md`, remover ou enxugar menções ao Lovable em "Git Workflow" e "External Dependencies" (deixar apenas referência mínima opcional, alinhada ao README).

## 3. Validação

- [x] 3.1 Executar `npm run build` e `npm run test` após remover `lovable-tagger`; confirmar que não há erros.
- [x] 3.2 Verificar com busca no código que não restam referências ao Lovable na UI, em meta tags ou em instruções de uso, exceto a referência de criação no README.
