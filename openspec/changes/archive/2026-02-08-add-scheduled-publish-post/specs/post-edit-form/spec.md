# post-edit-form — delta for add-scheduled-publish-post

## ADDED Requirements

### Requirement: Autor pode agendar a publicação para uma data e hora futuras

No formulário de **novo post** e de **edição de post**, o sistema **deve** (SHALL) permitir ao autor **agendar** a publicação para uma **data e hora futuras**. O formulário **deve** incluir um controlo de **calendário** (seleção da data) e um controlo de **hora** (ex.: HH:mm), visíveis na página "Novo Post" e "Editar Post". Quando o autor preenche uma data/hora futura e guarda, o post **deve** ser persistido como **rascunho** (`Published = false`) com o campo `scheduled_publish_at` definido (em UTC). O post **não** aparece nas listas públicas até que a data/hora agendada seja atingida e o sistema o publique automaticamente. O autor pode optar por "Publicar agora" (comportamento atual, checkbox Publicado) ou "Agendar publicação" (calendário + hora); quando há agendamento preenchido, o post é guardado como rascunho com essa data/hora. Ao editar um post que já tem agendamento, o formulário **deve** exibir a data/hora agendada (convertida para o fuso do utilizador).

#### Scenario: Autor agenda publicação no Novo Post

- **Dado** que o autor está no formulário "Novo post" e preencheu título, conteúdo e demais campos
- **Quando** o autor seleciona no calendário uma data futura (ex.: 10/Fevereiro) e uma hora (ex.: 09:00) e guarda
- **Então** o post é criado com `Published = false` e `scheduled_publish_at` igual à data/hora escolhida (em UTC)
- **E** o post **não** aparece na página inicial nem no Índice da História até à data/hora agendada
- **E** o post aparece na Área do autor (lista de posts) como rascunho, com indicação de agendamento (se implementado)

#### Scenario: Autor edita post e adiciona agendamento

- **Dado** que o autor está a editar um post que está em rascunho
- **Quando** o autor preenche no formulário a secção "Agendar publicação" com data/hora futura e guarda
- **Então** o post é atualizado com `scheduled_publish_at` definido e permanece `Published = false`
- **E** na data/hora agendada o sistema publicará o post automaticamente

#### Scenario: Autor remove agendamento ou publica agora

- **Dado** que o autor está a editar um post agendado ou a criar um novo
- **Quando** o autor deixa a data/hora de agendamento vazia e marca "Publicado" (ou não preenche agendamento e marca Publicado)
- **Então** ao guardar, o post é criado/atualizado com `Published = true` (ou mantido rascunho sem agendamento) e `scheduled_publish_at` é null
