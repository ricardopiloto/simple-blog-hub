# post-edit-form Specification

## Purpose
TBD - created by archiving change fix-post-excerpt-first-32-chars. Update Purpose after archive.
## Requirements
### Requirement: Excerpt auto-filled from first 32 characters of content

In the **new post** form, the Excerpt (Resumo) field SHALL be filled automatically with the first 32 characters of the text entered in the Content (Conteúdo) field, and SHALL be updated as the user types or edits the content (trimmed). In the **edit post** form, the Excerpt field SHALL **not** be updated automatically when the user changes the Content field; the Excerpt SHALL be set once from the saved post when the form loads and SHALL only change if the author edits the Excerpt field manually.

#### Scenario: Novo post — excerpt atualiza ao digitar no Conteúdo

- **Quando** o utilizador está no formulário **Novo post** e digita ou edita o campo Conteúdo
- **Então** o campo Resumo é preenchido (e atualizado) com os primeiros 32 caracteres do conteúdo (após trim)

#### Scenario: Editar post — excerpt NÃO atualiza ao digitar no Conteúdo

- **Dado** que o utilizador abriu o formulário **Editar post** e o Resumo foi carregado do post (ex.: "Primeiros trinta e dois caracteres do artigo...")
- **Quando** o utilizador altera o texto do campo Conteúdo
- **Então** o campo Resumo **não** é alterado automaticamente
- **E** o Resumo só muda se o utilizador editar o campo Resumo diretamente

#### Scenario: Editar post — autor pode editar o Resumo manualmente

- **Dado** que o utilizador está a editar um post
- **Quando** o utilizador altera o texto no campo Resumo (Input do Resumo)
- **Então** o valor do Resumo é atualizado conforme a edição manual
- **E** ao guardar, o excerpt enviado é o valor atual do campo Resumo

### Requirement: Novo post tem ordem inicial sugerida a partir do último artigo publicado

No fluxo de **criação** de um novo artigo (quando o utilizador clica em "Novo post"), o sistema **deve** (SHALL) obter do backend a **próxima ordem narrativa sugerida**: o maior `story_order` entre os posts **publicados** (Published == true) + 1, ou 1 se não existir nenhum post publicado. O campo **Ordem** no formulário **deve** ser pré-preenchido com esse valor, permanecendo **editável** pelo utilizador. A API **deve** expor um endpoint (ex.: GET /api/posts/next-story-order) que retorna esse valor; o BFF **deve** expor o mesmo para o frontend autenticado; o frontend **deve** chamar esse endpoint ao abrir o formulário de novo post e definir o estado inicial do campo com o valor retornado. Assim, "Novo Post" obtém sempre **último publicado + 1** (ex.: se o último publicado tem ordem 6, o próximo sugerido é 7). Rascunhos **não** entram no cálculo.

#### Scenario: Novo post com zero artigos publicados mostra ordem 1

- **Dado** que não existe nenhum post publicado
- **Quando** o utilizador abre o formulário "Novo post"
- **Então** o campo Ordem é preenchido com **1**
- **E** o utilizador pode alterar o valor antes de guardar

#### Scenario: Novo post após posts publicados mostra último publicado + 1

- **Dado** que existem posts publicados e o maior `story_order` entre eles é N (ex.: 6)
- **Quando** o utilizador abre o formulário "Novo post"
- **Então** o campo Ordem é preenchido com **N + 1** (ex.: 7)
- **E** o utilizador pode alterar o valor antes de guardar

#### Scenario: Rascunhos não afetam o próximo sugerido

- **Dado** que o maior `story_order` entre posts **publicados** é 3, e existe um rascunho com `story_order` 30
- **Quando** o utilizador abre o formulário "Novo post"
- **Então** o campo Ordem é preenchido com **4** (3 + 1), e não 31
- **E** o utilizador pode alterar o valor antes de guardar

### Requirement: Warning when story order is far ahead of suggested sequence

When the author enters a **story_order** value (in the new or edit post form) that is **more than a defined threshold** (e.g. 5) above the **suggested next** (the value returned by GET next-story-order, i.e. max over posts with IncludeInStoryOrder + 1), the frontend SHALL display a **warning** (e.g. inline message) so the author is aware that the order is far ahead of the current sequence. Example message: "Esta ordem está muito à frente da sequência atual. A próxima sugerida é X." The author MAY still save the form (override); the warning is advisory to avoid accidental large gaps. For the edit form, the frontend SHALL use the same suggested-next value (e.g. by calling next-story-order when the form loads or when the order field is edited) so that the warning can be shown if the user types a value far above that.

#### Scenario: Author sees warning when typing order far ahead

- **GIVEN** the suggested next story order is 6 (max existing is 5)
- **WHEN** the author opens "Novo post" or edits the Ordem field and enters a value greater than 11 (e.g. 30), i.e. more than threshold (5) above 6
- **THEN** the frontend SHALL show a warning (e.g. "Esta ordem está muito à frente da sequência atual. A próxima sugerida é 6.")
- **AND** the author can still save with the value 30 if they intend to (no block)
- **AND** if they correct to 6 or another value within threshold, the warning is hidden

### Requirement: Autor pode excluir o post da ordem da história

O formulário de **novo post** e de **edição de post** **deve** (SHALL) incluir uma opção (ex.: checkbox) que permite ao autor indicar se o artigo **faz parte da ordem da história** (incluído no Índice da História e na sequência anterior/próximo na página do artigo). Por defeito, esta opção **deve** estar **marcada** (o post faz parte da ordem). Quando o autor **desmarca** esta opção, o post **não** deve aparecer no menu "Índice da História" nem nos links anterior/próximo da página do artigo, mas continua publicado e visível na página inicial e na lista de artigos. A API **deve** persistir este valor (ex.: `include_in_story_order`) e **deve** utilizá-lo para filtrar a lista quando `order=story` e para calcular a próxima ordem sugerida (apenas entre posts que fazem parte da história).

#### Scenario: Novo post com "faz parte da ordem" marcado (default)

- **Dado** que o utilizador abre o formulário "Novo post"
- **Quando** o formulário é exibido
- **Então** a opção "Faz parte da ordem da história" (ou equivalente) está **marcada** por defeito
- **E** ao guardar, o post é criado com `include_in_story_order` verdadeiro e aparece no Índice da História

#### Scenario: Autor desmarca "faz parte da ordem da história"

- **Dado** que o utilizador está a editar um post (ou a criar um novo) e desmarca a opção "Faz parte da ordem da história"
- **Quando** o utilizador guarda o post
- **Então** o post é persistido com `include_in_story_order` falso
- **E** o post **não** aparece na página Índice da História
- **E** na página do artigo desse post, os links "anterior" e "próximo" (na sequência da história) não incluem este post; se for o post atual, pode não haver anterior/próximo na sequência

#### Scenario: Autor volta a marcar "faz parte da ordem"

- **Dado** que um post estava excluído da ordem da história (checkbox desmarcado)
- **Quando** o utilizador edita o post e marca novamente "Faz parte da ordem da história" e guarda
- **Então** o post passa a aparecer no Índice da História na posição definida por `story_order`
- **E** os links anterior/próximo na página do artigo passam a considerar este post na sequência

### Requirement: Orientação de tamanho da imagem de capa para não cortar

No formulário de **novo post** e de **edição de post**, junto ao campo "URL da imagem de capa" (e à opção de upload), o sistema **deve** (SHALL) exibir um texto de ajuda que informe ao autor a **proporção recomendada** (16:9) e **dimensões sugeridas** em pixels (ex.: 1200×675) para que a imagem não seja cortada na visualização. O objetivo é que o autor possa preparar ou escolher imagens nessa proporção e assim evitar que partes importantes sejam recortadas quando a capa for exibida com aspect ratio fixo (16:9) nas páginas do blog.

#### Scenario: Autor vê orientação de tamanho ao editar a capa

- **Dado** que o utilizador está no formulário de novo post ou de edição de post
- **Quando** o utilizador visualiza a secção da imagem de capa (campo URL e/ou upload)
- **Então** é exibido texto de ajuda com a proporção recomendada (16:9) e exemplo de dimensões (ex.: 1200×675 px) para não cortar a imagem
- **E** o texto está em português e visível próximo ao campo ou à opção de upload

#### Scenario: Orientação não bloqueia URL ou upload

- **Dado** que o autor vê a orientação de tamanho no formulário
- **Quando** o autor cola uma URL ou envia um ficheiro com dimensões diferentes da recomendada
- **Então** o sistema aceita e guarda a imagem normalmente
- **E** a orientação é apenas informativa, não validada

### Requirement: UI indica que agendamento vazio significa publicação imediata

No formulário de **novo post** e de **edição de post**, na secção **"Agendar publicação"** (calendário e campo de hora), o sistema **deve** (SHALL) exibir um **texto visível** que informe ao autor que **deixar a data e a hora de agendamento vazios** significa que o post será **publicado imediatamente** ao guardar (ao clicar em "Criar post" ou "Salvar"), de acordo com o estado do checkbox "Publicado". O texto **deve** estar junto aos controlos de data/hora (ex.: na descrição da secção ou logo abaixo do label "Agendar publicação"), para que o autor não fique em dúvida sobre o comportamento quando não preenche o agendamento. Exemplo de redação: "Deixe vazio para publicação imediata."

#### Scenario: Autor vê indicação de publicação imediata ao abrir o formulário

- **Dado** que o autor abre a página "Novo post" ou "Editar post"
- **Quando** o formulário é exibido
- **Então** na secção "Agendar publicação" (com calendário e campo de hora) o autor **vê** um texto que indica que deixar a data e a hora vazios resulta em publicação imediata ao guardar (ex.: "Deixe vazio para publicação imediata")
- **E** esse texto está visível sem necessidade de interação adicional (ex.: não está apenas em tooltip oculto)

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

### Requirement: Seleção obrigatória do tipo de história (Velho Mundo ou Idade das Trevas)

No formulário de **Novo post** e de **Editar post**, o sistema **deve** (SHALL) incluir um campo **obrigatório** que permite ao autor indicar a que história o post pertence: **"Velho Mundo"** ou **"Idade das Trevas"**. Este campo **deve** ser apresentado como um **toggle** de duas opções: **um lado** do toggle corresponde a "Velho Mundo" e o **outro lado** a "Idade das Trevas" (o autor escolhe clicando num dos lados). O campo **deve** aparecer **antes** do campo "Título". **Não** deve existir valor pré-definido: em novo post, nenhum dos lados do toggle vem selecionado; o utilizador **deve** escolher explicitamente um deles. O sistema **deve** impedir o envio (criar ou atualizar) enquanto nenhuma opção estiver selecionada (validação no frontend e na API). O valor **deve** ser persistido e devolvido nas respostas; ao editar um post, o valor guardado **deve** ser exibido no toggle (um dos lados selecionado) e pode ser alterado.

#### Scenario: Novo post — sem seleção não permite guardar

- **Dado** que o utilizador abre o formulário "Novo post"
- **Quando** o utilizador preenche título e conteúdo mas **não** seleciona nenhum dos lados do toggle (Velho Mundo / Idade das Trevas)
- **Então** o sistema impede o envio (ex.: validação no submit)
- **E** o utilizador é informado que deve selecionar a história (ex.: mensagem ou indicação no campo)

#### Scenario: Novo post — com seleção guarda o valor

- **Dado** que o utilizador abre o formulário "Novo post" e seleciona um lado do toggle ("Velho Mundo" ou "Idade das Trevas")
- **Quando** o utilizador preenche os demais campos e submete o formulário
- **Então** o post é criado com o valor de história selecionado persistido
- **E** em edições futuras desse post, o valor guardado é exibido no toggle

#### Scenario: Editar post — valor guardado é exibido e pode ser alterado

- **Dado** que um post existente tem tipo de história "Idade das Trevas"
- **Quando** o utilizador abre o formulário "Editar post" para esse post
- **Então** o toggle mostra "Idade das Trevas" selecionado (o lado correspondente ativo)
- **E** o utilizador pode alterar para "Velho Mundo" (ou manter) clicando no outro lado do toggle e, ao guardar, o novo valor é persistido

#### Scenario: Campo aparece antes do Título

- **Dado** que o utilizador abre "Novo post" ou "Editar post"
- **Quando** o formulário é exibido
- **Então** o toggle da história (Velho Mundo / Idade das Trevas) aparece como **primeiro** campo do formulário, imediatamente **antes** do campo "Título"

#### Scenario: Autor escolhe clicando num dos lados do toggle

- **Dado** que o utilizador está no formulário "Novo post" ou "Editar post"
- **Quando** o utilizador clica no lado "Velho Mundo" do toggle (ou no lado "Idade das Trevas")
- **Então** esse lado fica selecionado e o valor correspondente (`velho_mundo` ou `idade_das_trevas`) é guardado no estado
- **E** ao submeter o formulário, esse valor é enviado no payload `story_type`

### Requirement: Campo História exibe indicador visível de obrigatoriedade

No formulário de **Novo post** e de **Editar post**, o campo **"História"** (toggle Velho Mundo / Idade das Trevas) **deve** (SHALL) exibir de forma **visível** que é **obrigatório** — por exemplo, através de asterisco (*) no label ou do texto "(obrigatório)" junto ao label, de modo a que o autor perceba à primeira vista que deve escolher uma das opções antes de guardar. A validação no submit e a mensagem de erro quando nenhuma opção está selecionada mantêm-se; esta exigência refere-se apenas à **indicação visual** da obrigatoriedade.

#### Scenario: Autor vê que o campo História é obrigatório

- **Dado** que o utilizador abre o formulário "Novo post" ou "Editar post"
- **Quando** o formulário é exibido
- **Então** o label ou a área do campo "História" mostra uma indicação clara de que o campo é obrigatório (ex.: "História *" ou "História (obrigatório)")
- **E** o autor identifica sem ambiguidade que deve escolher "Velho Mundo" ou "Idade das Trevas" antes de poder guardar o post

### Requirement: Preview da imagem de capa apenas em Editar post (SHALL)

No formulário de **Editar post** (rota de edição de um post existente, ex.: `/area-autor/posts/:id/editar`), quando existir uma **URL de imagem de capa** — seja a carregada do post (`cover_image`) ou a definida pelo utilizador após colar URL ou fazer upload de ficheiro — o sistema **DEVE** (SHALL) exibir um **preview visual** dessa imagem na secção "URL da imagem de capa", de forma que o autor possa ver como a capa ficará antes de guardar. O preview **DEVE** ser uma imagem renderizada (ex.: elemento `<img>`) com a URL atual da capa, com dimensões e proporção adequadas (ex.: aspect ratio 16:9, tamanho limitado). No formulário **Novo post** o preview da imagem de capa **NÃO** deve ser exibido; apenas o campo URL e o upload permanecem, sem bloco de preview.

#### Scenario: Autor vê preview da capa ao editar post

- **Dado** que o utilizador está na página **Editar post** (post existente com ou sem capa)
- **Quando** existe uma URL de imagem de capa no formulário (carregada do post ou definida após upload/colagem)
- **Então** é exibido um preview visual da imagem (miniatura ou imagem com proporção adequada) na secção da imagem de capa
- **E** o autor pode confirmar visualmente a capa antes de guardar

#### Scenario: Novo post não exibe preview da capa

- **Dado** que o utilizador está na página **Novo post**
- **Quando** o utilizador preenche o campo URL da imagem de capa ou faz upload
- **Então** o formulário **não** exibe um bloco de preview da imagem de capa (apenas o campo e o upload, como hoje)
- **E** o comportamento em Novo post permanece inalterado em relação ao preview

### Requirement: Campo Conteúdo (Markdown) com abas Escrever e Preview (SHALL)

The **new post** and **edit post** form SHALL provide, for the **Content (Markdown)** field, **two tabs**: (1) **Escrever** (or "Markdown") — the text area where the author writes and edits the post body in Markdown; (2) **Preview** — a view of how the current content will appear when published, i.e. the Markdown converted to HTML and displayed with the same typography as the main text area on the article page (e.g. prose styles). The Preview SHALL show **only** the content area (no cover image, no article header, no author block); it SHALL be updated when the author switches to the Preview tab so that it reflects the current value of the content field. The **Preview container** SHALL have the **same size** (height and width) as the write-mode text area; when the content is long, it SHALL show a **scrollbar** so the author can scroll within the same fixed area, in the same way as when editing in the text area. The frontend MAY convert Markdown to HTML in the client for the Preview (e.g. using a library such as marked) and SHALL sanitize the resulting HTML (e.g. with DOMPurify) before rendering.

#### Scenario: Autor alterna para Preview e vê o conteúdo renderizado

- **GIVEN** the author is on the new post or edit post form and has entered some text in the Content (Markdown) field
- **WHEN** they click the "Preview" tab (or equivalent) next to the Conteúdo (Markdown) label
- **THEN** they see the current content rendered as HTML with the same typography as the article body (e.g. prose)
- **AND** no cover image or article header is shown in the Preview
- **AND** they can switch back to the "Escrever" tab to continue editing

#### Scenario: Preview reflete o conteúdo atual ao mudar de aba

- **GIVEN** the author is on the edit post form and changes the text in the Content field (Escrever tab)
- **WHEN** they switch to the Preview tab
- **THEN** the Preview shows the updated content (the value currently in the content state)
- **AND** formatting such as headings, bold, lists, and links is rendered as it would appear on the article page

#### Scenario: Preview mantém o mesmo tamanho da área de escrita e barra de rolagem

- **GIVEN** the author is on the new post or edit post form
- **WHEN** they switch to the "Preview" tab
- **THEN** the Preview container has the same height and width as the "Escrever" text area (same box size)
- **AND** when the content is long, a vertical scrollbar appears so the author can scroll within that area, in the same way as when the area is the write-mode text area

### Requirement: Atualizar post rascunho para agendado sem erro 500 (SHALL)

When the author **edits a draft post** (post with `published === false`), enables **Agendar publicação** (schedule publish), fills in a future date and time, and **saves**, the system SHALL update the post successfully and SHALL **not** return 500 Internal Server Error. The BFF endpoint PUT /bff/posts/{id} (and the API PUT that it proxies) SHALL accept the payload with `scheduled_publish_at` set and `published` false, persist the post as draft with `scheduled_publish_at` defined, and return a successful response (2xx) with the updated post. This applies specifically to the transition from **draft without schedule** to **draft with schedule**.

#### Scenario: Editar rascunho, ativar agendamento e guardar com sucesso

- **Dado** que o autor está a editar um post que está em **rascunho** (sem agendamento)
- **Quando** o autor ativa o toggle "Agendar publicação", preenche data e hora futuras e clica em Guardar
- **Então** o sistema responde com **200** (ou 2xx) e o post é atualizado
- **E** o post fica com `scheduled_publish_at` definido e `published === false`
- **E** o sistema **não** devolve 500 Internal Server Error
- **E** o post aparece na Área do autor como agendado (conforme comportamento existente)

