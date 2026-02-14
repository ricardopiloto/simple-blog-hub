# post-reading Specification

## Purpose

Define o comportamento da página de leitura de um artigo (post) na face pública do blog: exibição do conteúdo e da descrição do autor no final da página.
## Requirements
### Requirement: Página do artigo exibe a descrição do autor após o conteúdo

A página de leitura de um artigo (`/post/:slug`) SHALL exibir, no final da página e depois do texto do artigo, a descrição do autor — a mesma frase breve que o autor pode configurar na tela de Contas (perfil). A descrição SHALL be presented in a dedicated section (e.g. author name, avatar if present, and description text). The API/BFF SHALL include the `author.bio` field in the post response when served for public reading. If the author has no description (`bio` null or empty), the section MAY be omitted.

#### Scenario: Leitor vê a descrição do autor no final do artigo

- **Dado** um post publicado cujo autor tem descrição configurada na tela de Contas
- **Quando** um utilizador abre a página do artigo (por slug)
- **Então** após o conteúdo do artigo é exibida uma secção com o nome do autor e o texto da descrição (e avatar se existir)
- **E** o texto exibido é o mesmo configurado no perfil do autor em Contas

#### Scenario: Artigo sem descrição do autor não mostra secção vazia

- **Dado** um post cujo autor não tem descrição configurada (`author.bio` nulo ou vazio)
- **Quando** um utilizador abre a página do artigo
- **Então** não é exibida uma secção de descrição do autor (ou a secção é omitida)

#### Scenario: Resposta pública do post inclui author.bio

- **Quando** o cliente solicita um post por slug para leitura pública
- **Então** a resposta inclui o objeto do autor com pelo menos `name` e `bio` (e opcionalmente `avatar`)

### Requirement: Página do artigo exibe navegação para post anterior e próximo na ordem narrativa

A página de leitura de um artigo (`/post/:slug`) **deve** (SHALL) exibir **no final da página**, após o conteúdo e a secção de descrição do autor (quando existir), uma **secção de navegação** com duas opções baseadas na **ordem narrativa** definida pelos autores (campo `story_order`), considerando apenas posts **publicados**:

- **À esquerda**: link para o **post anterior** na ordem (post publicado com `story_order` imediatamente inferior). Exibido **apenas** quando existir um post anterior (o artigo atual não é o primeiro na sequência).
- **À direita**: link para o **próximo post** na ordem (post publicado com `story_order` imediatamente superior). Exibido **apenas** quando existir um próximo (o artigo atual não é o último na sequência).

A mesma ordem usada no **Índice da História** (lista de posts publicados ordenados por `story_order`) **deve** ser usada para determinar anterior e próximo. Se o post atual não fizer parte dessa lista (ex.: é um rascunho acessado por link direto), a secção de navegação **pode** ser omitida.

#### Scenario: Leitor no primeiro post vê apenas link para o próximo

- **Dado** um post publicado que é o primeiro na ordem narrativa (menor `story_order` entre publicados)
- **Quando** um utilizador abre a página do artigo
- **Então** no final da página é exibido apenas o link para o **próximo post** (à direita)
- **E** não é exibido link "Post anterior" (ou equivalente à esquerda)

#### Scenario: Leitor no último post vê apenas link para o anterior

- **Dado** um post publicado que é o último na ordem narrativa (maior `story_order` entre publicados)
- **Quando** um utilizador abre a página do artigo
- **Então** no final da página é exibido apenas o link para o **post anterior** (à esquerda)
- **E** não é exibido link "Próximo post" (ou equivalente à direita)

#### Scenario: Leitor no meio da sequência vê anterior e próximo

- **Dado** um post publicado que não é o primeiro nem o último na ordem narrativa
- **Quando** um utilizador abre a página do artigo
- **Então** no final da página são exibidos o link para o **post anterior** (à esquerda) e o link para o **próximo post** (à direita)
- **E** ao clicar em cada link o utilizador é levado ao artigo correto na ordem do Índice da História

#### Scenario: Ordem da navegação coincide com o Índice da História

- **Dado** a lista de posts publicados ordenados por `story_order` (como no Índice)
- **Quando** o utilizador está na página de um desses posts
- **Então** o "post anterior" é o que aparece imediatamente antes na mesma lista
- **E** o "próximo post" é o que aparece imediatamente depois na mesma lista

### Requirement: Títulos truncados nos links anterior/próximo cortam pelo final

Na secção de navegação **Post anterior** e **Próximo post** no final da página do artigo (`/post/:slug`), quando o título do post adjacente é longo e não cabe no espaço disponível, o sistema **deve** (SHALL) truncar o texto pelo **final** do título, exibindo reticências no fim (ex.: "Um título muito longo que..."). O **início** do título **deve** permanecer sempre visível, em ambos os links (anterior à esquerda e próximo à direita). Os ícones ou etiquetas ("Post anterior", "Próximo post") **devem** permanecer visíveis; apenas o título do artigo adjacente pode ser truncado. Opcionalmente, o título completo pode ser mostrado em tooltip (atributo `title`) ao passar o rato.

#### Scenario: Título longo no link "Post anterior" mostra início e reticências no fim

- **Dado** que o post anterior na ordem narrativa tem um título muito longo (ex.: "As Aventuras Incríveis do Herói na Terra dos Dragões")
- **Quando** o utilizador visualiza a página do artigo e a secção de navegação anterior/próximo
- **Então** no link "Post anterior" é exibido o início do título seguido de reticências (ex.: "As Aventuras Incríveis do He...")
- **E** não é exibido apenas o final do título com reticências no início

#### Scenario: Título longo no link "Próximo post" mostra início e reticências no fim

- **Dado** que o próximo post na ordem narrativa tem um título muito longo
- **Quando** o utilizador visualiza a secção de navegação (link "Próximo post" à direita)
- **Então** no link "Próximo post" é exibido o início do título seguido de reticências no fim
- **E** o ícone ou seta do próximo post permanece visível à direita do título truncado

### Requirement: Efeito visual de clima (chuva ou neve) quando o texto do artigo descreve a cena (SHALL)

Na página de leitura de um artigo (`/post/:slug`), **após** o conteúdo estar carregado e exibido, o sistema **deve** (SHALL) analisar o **texto do artigo** (conteúdo HTML convertido para texto plano) em busca de palavras que indiquem o **clima da cena** — limitado a **chuva** ou **neve**. A lista de palavras **deve** incluir **sinónimos** e **conjugações verbais** (ex.: chuva, choveu, chovendo, chove, neve, nevou, nevando, neva, nevava), de forma a identificar **qualquer variação** de chuva ou neve no texto; termos em português e equivalentes em inglês (ex.: rain, snow, raining, snowing). O efeito **só deve** ser exibido **se o utilizador tiver os efeitos de clima ativados** (ver requisito "Controlo no header para ativar ou desativar efeitos de clima"). Se for detectada **neve** e os efeitos estiverem ativados, o sistema **deve** exibir um **efeito visual discreto de neve** durante a leitura; se for detectada apenas **chuva** (e não neve) e os efeitos estiverem ativados, **deve** exibir um **efeito visual discreto de chuva**. Se o texto contiver palavras de ambos os tipos, **deve** ser exibido apenas um efeito (prioridade: **neve** sobre chuva). Se não for detectada nenhuma dessas palavras, ou se o utilizador tiver desativado os efeitos, **não** deve ser exibido efeito. O efeito **deve** ser **discreto** (baixa opacidade, não obstruir a leitura) e **não** deve bloquear a interação do utilizador (ex.: pointer-events: none no overlay). O efeito aplica-se apenas na página do artigo e apenas enquanto o leitor permanece nessa página.

#### Scenario: Leitor abre artigo que menciona chuva e vê efeito discreto de chuva

- **Dado** um post publicado cujo conteúdo em texto contém uma palavra que indica chuva (ex.: "A chuva caía sem parar.")
- **Quando** um leitor abre a página do artigo (por slug) e o conteúdo é carregado
- **Então** é exibido um efeito visual discreto de chuva sobre a área de leitura
- **E** o efeito não impede a leitura nem o clique em links

#### Scenario: Leitor abre artigo que menciona neve e vê efeito discreto de neve

- **Dado** um post publicado cujo conteúdo em texto contém uma palavra que indica neve (ex.: "A neve cobria a estrada.")
- **Quando** um leitor abre a página do artigo e o conteúdo é carregado
- **Então** é exibido um efeito visual discreto de neve sobre a área de leitura
- **E** o efeito é discreto (baixa opacidade)

#### Scenario: Artigo sem palavras de chuva ou neve não exibe efeito

- **Dado** um post publicado cujo conteúdo em texto **não** contém nenhuma palavra que indique chuva ou neve
- **Quando** um leitor abre a página do artigo
- **Então** não é exibido qualquer efeito de clima
- **E** a página comporta-se como antes (apenas conteúdo e navegação)

#### Scenario: Texto com chuva e neve exibe apenas efeito de neve

- **Dado** um post cujo conteúdo em texto contém palavras que indicam tanto chuva como neve
- **Quando** um leitor abre a página do artigo
- **Então** é exibido apenas o efeito de **neve** (prioridade sobre chuva)
- **E** não é exibido efeito de chuva em simultâneo

#### Scenario: Utilizador desativou os efeitos — nenhum artigo exibe efeito

- **Dado** que o utilizador desativou os efeitos de clima através do botão no header (preferência persistida)
- **Quando** o utilizador abre qualquer página de artigo, incluindo uma cujo texto contém palavras de chuva ou neve
- **Então** não é exibido qualquer efeito de clima
- **E** a preferência mantém-se após recarregar a página ou navegar para outro artigo

### Requirement: Controlo no header para ativar ou desativar efeitos de clima (SHALL)

O sistema **deve** (SHALL) fornecer um **controlo no header** do site (ao lado do botão de seleção de tema claro/escuro) que permita ao utilizador **ativar ou desativar** os efeitos de clima (chuva/neve) na leitura. O controlo **deve** ter o **mesmo estilo visual** do botão de tema (ex.: botão ghost, ícone). A preferência **deve** ser **persistida** (ex.: em localStorage) e **aplica-se a todas as páginas de artigo** do blog: quando o utilizador desativa os efeitos, **nenhum** artigo exibe efeito de clima, independentemente do conteúdo; quando reativa, os artigos cujo texto indique chuva ou neve voltam a exibir o efeito. O valor por defeito **deve** ser **efeitos ativados** (true) para utilizadores que nunca alteraram a opção.

#### Scenario: Utilizador alterna o controlo de efeitos no header

- **Dado** que o utilizador está em qualquer página do blog
- **Quando** o utilizador clica no botão de efeitos no header (ao lado do botão de tema)
- **Então** a preferência alterna (ativado ↔ desativado) e é persistida (ex.: localStorage)
- **E** o botão tem o mesmo estilo visual do botão de tema (ghost, ícone)

