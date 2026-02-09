# Design: Tipo de história no post

## Modelo de dados

- **Coluna na tabela Posts**: `StoryType` (string, NOT NULL).
- **Valores permitidos**: Dois identificadores fixos, por exemplo:
  - `velho_mundo` → exibido na UI como "Velho Mundo"
  - `idade_das_trevas` → exibido na UI como "Idade das Trevas"

Usar slugs em vez do texto de exibição na API/BD permite evoluir os rótulos na UI sem migração de dados.

## Migração

- Adicionar a coluna `StoryType` à tabela `Posts` como NOT NULL.
- Para **posts já existentes**, definir um valor por defeito na migração (ex.: `velho_mundo`) de forma a que a coluna possa ser NOT NULL e nenhum registo fique inválido. Após o deploy, os autores podem editar o post e alterar o valor se necessário.
- Alternativa considerada: coluna nullable e exigir valor apenas em novos posts; rejeitada para simplificar (um único esquema: sempre NOT NULL, migração preenche o passado).

## API / JSON

- **Request (create/update)**: incluir `story_type` (string) com um dos valores `velho_mundo` ou `idade_das_trevas`; a API rejeita pedidos sem este campo ou com valor diferente (ex.: 400 Bad Request).
- **Response (PostDto)**: incluir `story_type` (string) com o valor persistido.
- Validação na API: o valor deve ser exatamente um dos dois permitidos; caso contrário, retornar erro de validação.

## Frontend

- Estado inicial no formulário (novo post): nenhuma opção selecionada (ex.: `storyType === ''` ou valor sentinela).
- Estado ao carregar post para edição: preencher o controlo com `post.story_type`.
- Validação antes de submit: impedir envio se nenhuma opção estiver selecionada; exibir mensagem ou indicar o campo como obrigatório (e.g. "Selecione a história").
- Posição: o bloco do campo "História" (ou "Tipo de história") deve ser o **primeiro** do formulário, imediatamente antes do bloco "Título".

## BFF

- Repasse transparente: o BFF envia o body do create/update para a API e devolve a resposta; basta que o frontend envie `story_type` e que a API o inclua no DTO de resposta. Nenhuma lógica específica no BFF além do pass-through já existente.
