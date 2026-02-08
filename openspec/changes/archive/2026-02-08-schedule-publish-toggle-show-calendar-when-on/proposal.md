# Toggle "Agendar publicação": exibir calendário apenas quando ativado

## Summary

Melhorar a funcionalidade de **agendamento de publicação** (add-scheduled-publish-post) com um **toggle** (ex.: Switch): quando o autor **ativa** "Agendar publicação", o sistema exibe o calendário e o campo de hora; quando **não** ativa, esses controlos ficam ocultos e a publicação segue o checkbox "Publicado" (publicação imediata ao guardar). Assim fica explícito que "sem agendamento = publicação imediata" sem depender do texto "Deixe vazio para publicação imediata" da change clarify-empty-schedule-means-immediate-publish.

**Comportamento já garantido no código**: O fluxo de "Criar post" / "Salvar" já trata a ausência de data de agendamento como publicação imediata (payload com `scheduled_publish_at: null` e `published` conforme o checkbox). A API, quando não recebe data futura em `scheduled_publish_at`, publica imediatamente conforme `published`. Nenhuma alteração de lógica de negócio é necessária; apenas a UI passa a usar um toggle para mostrar ou ocultar o calendário.

## Goals

1. **Toggle na UI**: No formulário Novo post e Editar post, a secção de agendamento passa a ter um **toggle** (Switch) "Agendar publicação". **Desligado** (predefinido em novo post): o calendário e o campo de hora **não** são exibidos; ao guardar, não se envia agendamento → publicação imediata conforme "Publicado". **Ligado**: exibir calendário e campo de hora; ao guardar com data/hora futura, enviar `scheduled_publish_at` e o post fica como rascunho até à data.
2. **Carregar post com agendamento**: Ao editar um post que tem `scheduled_publish_at`, o toggle deve vir **ligado** e a data/hora preenchidos. Ao editar um post sem agendamento, o toggle vem **desligado**.
3. **Reverter clarify**: Remover o texto "Deixe vazio para publicação imediata" introduzido em clarify-empty-schedule-means-immediate-publish, já que o toggle deixa o comportamento claro.
4. **Spec**: Delta em post-edit-form descrevendo o toggle e que sem ele (ou com ele desligado) a publicação é imediata.

## Out of scope

- Alterar a API ou o BFF (já comportam-se corretamente).
- Traduções.

## Success criteria

- Novo post: toggle "Agendar publicação" desligado por defeito; calendário e hora ocultos; ao guardar com "Publicado" marcado, o post é publicado imediatamente.
- Toggle ligado: calendário e hora visíveis; preenchendo data/hora futura e guardando, o post fica agendado.
- Editar post com agendamento: toggle ligado e data/hora preenchidos.
- O texto "Deixe vazio para publicação imediata" não aparece no formulário.
- `openspec validate schedule-publish-toggle-show-calendar-when-on --strict` passa.
