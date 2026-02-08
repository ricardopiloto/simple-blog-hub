# Clarify: data/hora de agendamento vazia = publicação imediata

## Summary

Na funcionalidade de **agendamento de publicação** (change add-scheduled-publish-post), quando o autor **não** define data nem hora na secção "Agendar publicação", o post é criado/atualizado com **publicação imediata** (respeitando o estado do checkbox "Publicado"). Este comportamento já está implementado, mas não está explícito na interface: o autor pode não perceber que deixar o calendário e a hora vazios resulta em publicar imediatamente ao clicar em "Criar post" ou "Salvar".

## Goals

1. **Texto na UI**: Na página "Novo post" e "Editar post", na secção "Agendar publicação" (junto ao calendário e ao campo de hora), o sistema **deve** exibir um texto que deixe claro que **deixar a data e a hora vazios** significa **publicação imediata** ao guardar. Exemplo: "Deixe vazio para publicação imediata" (ou equivalente em português), visível ao lado ou abaixo dos controlos de data/hora.
2. **Spec**: Delta em post-edit-form exigindo que a UI informe explicitamente que o agendamento vazio resulta em publicação imediata.

## Out of scope

- Alterar a lógica de negócio (já está correta).
- Traduções para outros idiomas (mantém-se português como na UI atual).

## Success criteria

- O utilizador que abre "Novo post" ou "Editar post" vê, na secção de agendamento, uma indicação clara de que deixar data/hora vazios implica publicação imediata ao guardar.
- `openspec validate clarify-empty-schedule-means-immediate-publish --strict` passa.
