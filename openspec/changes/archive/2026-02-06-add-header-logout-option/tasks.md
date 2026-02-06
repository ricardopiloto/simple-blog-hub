## 1. Verificação do comportamento atual

- [x] 1.1 Confirmar que o header exibe uma opção de Logout (ex.: "Sair") quando o usuário está autenticado, ao lado de "Área do autor", tanto na navegação desktop quanto no menu mobile.
- [x] 1.2 Confirmar que a opção de Logout não aparece quando o usuário não está autenticado (apenas o link de Login é exibido).
- [x] 1.3 Confirmar que, ao acionar Logout, o sistema chama `logout()` do contexto de autenticação e redireciona para a página inicial (`/`).

## 2. Documentação

- [x] 2.1 Verificar se README e/ou openspec/project.md mencionam a opção de logout no menu superior para usuários autenticados; ajustar se necessário.

## 3. Validação

- [x] 3.1 Executar `openspec validate add-header-logout-option --strict` e corrigir qualquer falha.
