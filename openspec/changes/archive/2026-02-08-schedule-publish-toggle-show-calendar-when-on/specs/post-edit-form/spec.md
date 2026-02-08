# post-edit-form — delta for schedule-publish-toggle-show-calendar-when-on

## ADDED Requirements

### Requirement: Toggle "Agendar publicação" controla visibilidade do calendário; desligado = publicação imediata

No formulário de **novo post** e de **edição de post**, o sistema **deve** (SHALL) incluir um **toggle** (ex.: Switch) com label "Agendar publicação". **Quando o toggle está desligado** (predefinido ao criar um novo post): o calendário e o campo de hora **não** são exibidos; ao guardar, o post é criado/atualizado **sem** agendamento (`scheduled_publish_at` null), ou seja, **publicação imediata** conforme o estado do checkbox "Publicado". **Quando o toggle está ligado**: o sistema exibe o calendário (seleção de data) e o campo de hora; o autor pode definir data/hora futura e, ao guardar, o post fica agendado (rascunho até à data). Ao **editar um post que já tem** `scheduled_publish_at`, o toggle **deve** vir **ligado** e a data/hora agendada **devem** estar preenchidos. Ao editar um post sem agendamento, o toggle vem **desligado**. Esta apresentação deixa claro que "sem agendar = publicação imediata" sem necessidade de texto adicional.

#### Scenario: Novo post com toggle desligado — publicação imediata

- **Dado** que o autor abre "Novo post" e preenche título e conteúdo
- **Quando** o toggle "Agendar publicação" está **desligado** (estado inicial) e o autor marca "Publicado" e clica em "Criar post"
- **Então** o calendário e o campo de hora **não** estão visíveis
- **E** o post é criado com `scheduled_publish_at` null e `published` true (publicação imediata)

#### Scenario: Autor liga o toggle e agenda

- **Dado** que o autor está em "Novo post" ou "Editar post"
- **Quando** o autor **liga** o toggle "Agendar publicação"
- **Então** o calendário e o campo de hora são exibidos
- **E** o autor pode selecionar uma data/hora futura e, ao guardar, o post fica agendado (rascunho com `scheduled_publish_at`)

#### Scenario: Editar post agendado — toggle ligado e data preenchida

- **Dado** que o autor abre "Editar post" para um post que tem `scheduled_publish_at` definido
- **Quando** o formulário é carregado
- **Então** o toggle "Agendar publicação" está **ligado**
- **E** a data e a hora agendadas estão preenchidas nos controlos
- **E** o autor pode alterar ou desligar o toggle para remover o agendamento
