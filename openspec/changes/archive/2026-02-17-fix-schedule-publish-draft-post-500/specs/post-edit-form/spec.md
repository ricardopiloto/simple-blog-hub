# post-edit-form — delta for fix-schedule-publish-draft-post-500

## ADDED Requirements

### Requirement: Atualizar post rascunho para agendado sem erro 500 (SHALL)

When the author **edits a draft post** (post with `published === false`), enables **Agendar publicação** (schedule publish), fills in a future date and time, and **saves**, the system SHALL update the post successfully and SHALL **not** return 500 Internal Server Error. The BFF endpoint PUT /bff/posts/{id} (and the API PUT that it proxies) SHALL accept the payload with `scheduled_publish_at` set and `published` false, persist the post as draft with `scheduled_publish_at` defined, and return a successful response (2xx) with the updated post. This applies specifically to the transition from **draft without schedule** to **draft with schedule**.

#### Scenario: Editar rascunho, ativar agendamento e guardar com sucesso

- **Dado** que o autor está a editar um post que está em **rascunho** (sem agendamento)
- **Quando** o autor ativa o toggle "Agendar publicação", preenche data e hora futuras e clica em Guardar
- **Então** o sistema responde com **200** (ou 2xx) e o post é atualizado
- **E** o post fica com `scheduled_publish_at` definido e `published === false`
- **E** o sistema **não** devolve 500 Internal Server Error
- **E** o post aparece na Área do autor como agendado (conforme comportamento existente)
