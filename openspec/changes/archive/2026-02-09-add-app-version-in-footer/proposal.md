# Versão da aplicação no rodapé

## Summary

Adicionar uma funcionalidade que **controla qual versão está a ser utilizada** e **atualiza automaticamente o rodapé** com a versão atual da aplicação. A versão deve ter uma **única fonte de verdade** (ex.: `package.json` do frontend ou variável de ambiente à build) e ser **injetada em tempo de build** no frontend, de forma a que o rodapé exiba de forma visível a versão (ex.: "Versão 1.7" ou "v1.7") sem necessidade de chamadas em runtime. Assim, utilizadores e operadores podem identificar rapidamente que versão do frontend está em execução.

## Goals

1. **Fonte única da versão**: A versão da aplicação é definida num único sítio — por exemplo, o campo `version` do `package.json` do frontend, ou uma variável de ambiente à build (ex.: `VITE_APP_VERSION`) que sobrescreve quando definida. O projeto já usa tags de release (v1.3, v1.4, …) e CHANGELOG; alinhar a versão exibida com essa convenção (ex.: 1.7 ou v1.7).
2. **Injeção em tempo de build**: O Vite (ou o processo de build) expõe a versão como constante substituída no bundle (ex.: `define` no `vite.config` a partir de `package.json` ou de `import.meta.env.VITE_APP_VERSION`), para que não seja necessária uma chamada à API nem um ficheiro extra em runtime.
3. **Rodapé atualizado automaticamente**: O componente Footer exibe a versão atual (ex.: uma linha "Versão 1.7" ou "v1.7" em texto discreto, ou junto ao copyright). Sempre que se fizer um novo build com a versão atualizada na fonte, o rodapé reflete essa versão automaticamente.
4. **Opcional em desenvolvimento**: Se a versão não estiver definida ou for "0.0.0", o rodapé pode exibir "Versão dev" ou omitir a linha, conforme decisão de implementação.

## Out of scope

- Alterar a API ou o BFF para servir a versão (a versão é apenas do frontend e definida à build).
- Versionamento do backend (API/BFF) no rodapé; apenas a versão da aplicação frontend.
- Automatização de atualização do `package.json` em pipelines (pode ser tratado separadamente); a proposta assume que a fonte da versão é atualizada manualmente ou por script no release.

## Success criteria

- Existe uma única fonte de verdade para a versão (ex.: `package.json` ou `VITE_APP_VERSION` à build).
- O rodapé exibe a versão atual da aplicação (ex.: "Versão 1.7" ou "v1.7") de forma visível e discreta.
- Ao fazer build com a versão atualizada (ex.: após alterar `package.json` para "1.7.0" ou definir `VITE_APP_VERSION=1.7`), o rodapé mostra essa versão sem alteração de código no Footer.
- `openspec validate add-app-version-in-footer --strict` passa.
