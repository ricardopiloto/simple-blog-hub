# Design: Capa com object-contain na página do artigo

## Decisões

### object-contain na página do post

- Na **página do artigo** (PostPage), a área de capa usa um contentor com aspect ratio 16:9. Com **object-fit: contain**, a imagem é escalada para caber **inteiramente** dentro desse contentor (sem cortar). Se a imagem for 4:3, 1:1 ou vertical, surgirão faixas (letterboxing ou pillarboxing); com **object-position: center**, a imagem fica centrada.
- Isso corresponde ao pedido de "resize da imagem para caber melhor": o redimensionamento é visual (CSS), mostrando a imagem completa em vez de a cortar.

### Fundo das faixas

- Para que as faixas vazias não fiquem em branco ou com cor de fundo imprevisível, o contentor da capa terá uma classe de fundo neutro (ex.: `bg-muted`), alinhada ao tema claro/escuro. Assim o enquadramento fica consistente.

### object-cover nos cards

- Em **PostCard**, **StoryIndex** e **FeaturedPost** mantém-se **object-cover**: os cards têm todos o mesmo aspecto (caixa preenchida) e a orientação de "mostrar imagem inteira" aplica-se apenas à vista de leitura do artigo, onde o utilizador se foca numa única capa.
