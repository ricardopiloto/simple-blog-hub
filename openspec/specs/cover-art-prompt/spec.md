# cover-art-prompt Specification

## Purpose

Server-side generation of cover art prompts for the post edit form via DeepSeek (direct API).

## Requirements

### Requirement: JWT endpoint for DeepSeek cover art prompt generation in post form (SHALL)

The BFF **SHALL** expose **`POST /bff/image-generation/generate-cover-art-prompt`** for **authenticated authors** (JWT required). The endpoint **SHALL** accept JSON `{ "content": "..." }` with non-empty `content` — the Markdown from **`#post-content`**. The BFF **SHALL** call the **DeepSeek API directly** at **`https://api.deepseek.com/chat/completions`** ( **not** via OpenRouter) using **`Integrations:DeepSeek:ApiKey`** / **`DEEPSEEK__APIKEY`** and model **`Integrations:DeepSeek:Model`** / **`DEEPSEEK__MODEL`** (default **`deepseek-chat`**). The BFF **SHALL** send a single **user** message:

```text
Com base na cena descrita abaixo, me ajude a montar um prompt que resuma a cena utilizando o estilo: Photographic, detailed, grimdark.
{content}
```

On success, the BFF **SHALL** return **`{ "prompt": "<text>" }`** from **`choices[0].message.content`**. The frontend **SHALL** set this value in **`#post-art-prompt`**. The DeepSeek API key **SHALL NOT** be exposed to the browser. This endpoint **SHALL** power **"Gerar prompt para arte"** and **SHALL NOT** use OpenRouter.

#### Scenario: Authenticated author generates art prompt via DeepSeek direct API

- **GIVEN** `DEEPSEEK__APIKEY` is configured on the BFF
- **WHEN** an authenticated author sends `POST /bff/image-generation/generate-cover-art-prompt` with `{ "content": "# Scene\n..." }`
- **THEN** the BFF calls `https://api.deepseek.com/chat/completions` (not OpenRouter)
- **AND** returns **200** with `{ "prompt": "..." }` for `#post-art-prompt`
- **AND** the user message includes **Photographic, detailed, grimdark**

#### Scenario: Empty content rejected

- **WHEN** an authenticated author sends `{ "content": "" }` or whitespace only
- **THEN** the BFF responds with **400 Bad Request**

#### Scenario: DeepSeek not configured

- **GIVEN** `DEEPSEEK__APIKEY` is missing or empty
- **WHEN** an authenticated author calls `POST /bff/image-generation/generate-cover-art-prompt`
- **THEN** the BFF responds with **503** and does not call DeepSeek

#### Scenario: Unauthenticated request is rejected

- **WHEN** a client calls `POST /bff/image-generation/generate-cover-art-prompt` without a valid JWT
- **THEN** the BFF responds with **401 Unauthorized**
