# post-edit-form — delta for add-post-include-in-story-order

## ADDED Requirements

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
