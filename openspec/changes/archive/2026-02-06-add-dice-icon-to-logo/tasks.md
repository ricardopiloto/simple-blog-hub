# Tasks: add-dice-icon-to-logo

## 1. Asset do ícone

- [x] 1.1 Baixar o SVG "Dice 20 faces 1" (Delapouite) de [game-icons.net](https://game-icons.net/1x1/delapouite/dice-twenty-faces-one.html) — usar variante preto/transparente (ex.: `https://game-icons.net/icons/000000/transparent/1x1/delapouite/dice-twenty-faces-one.svg`) para permitir estilização com `currentColor` em tema claro/escuro. Salvar no projeto (ex.: `public/dice-icon.svg` ou `src/assets/dice-icon.svg`).
- [x] 1.2 Se necessário, ajustar o SVG (viewBox, width/height, ou stroke/fill para `currentColor`) para que o ícone escale e herde a cor do texto no header/footer.

## 2. Logo no Header e no Footer

- [x] 2.1 No Header: no link da marca, exibir o ícone (img ou inline SVG) à esquerda do texto "noDado RPG" (remover o "1" do texto). Garantir alinhamento e tamanho proporcional (ex.: ícone com altura aproximada da fonte do título).
- [x] 2.2 No Footer: na área de marca (link para home) e no copyright, exibir o mesmo padrão: ícone + "noDado RPG". No copyright manter "© {ano} [ícone]noDado RPG. Todos os direitos reservados." (visualmente ícone + nome).

## 3. Atribuição e documentação

- [x] 3.1 Adicionar atribuição do ícone (CC BY 3.0, Delapouite, game-icons.net), por exemplo no rodapé do site (link discreto) ou no README. Ex.: "Ícone de dado: Delapouite, [game-icons.net](https://game-icons.net/1x1/delapouite/dice-twenty-faces-one.html), CC BY 3.0."
- [x] 3.2 Em `openspec/project.md`, na seção de branding ou convenções, mencionar que o logo do blog é composto pelo ícone de d20 (game-icons.net) e o texto "noDado RPG".

## 4. Validação

- [x] 4.1 Executar `npm run build` e `npm run test`; confirmar que não há erros.
- [x] 4.2 Verificar visualmente (ou via snapshot) que o header e o footer exibem ícone + "noDado RPG" e que o ícone respeita o tema (cor legível em claro e escuro).
