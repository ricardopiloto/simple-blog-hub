# post-reading — delta for add-scene-weather-effect

## ADDED Requirements

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
