# Design: Orientação de tamanho e enquadramento da capa

## Decisões

### Proporção de exibição

- **16:9** é usada na página do post, nos cards da lista de artigos e nos cards do Índice da História. O bloco de destaque na página inicial usa **4:3**. Para evitar confusão, a orientação no formulário recomenda **16:9**, que cobre a maioria dos contextos; imagens em 4:3 continuarão a ser exibidas no destaque com crop central.
- Não se altera a proporção do destaque para 16:9 neste change, para manter o escopo pequeno.

### Object-fit e object-position

- **object-fit: cover** mantém-se: a área de exibição é sempre preenchida; imagens maiores são cortadas. Assim evitamos letterboxing e o layout permanece estável.
- **object-position: center** garante que, quando a imagem for cortada, o centro seja privilegiado, resultando em enquadramento previsível. O autor que usar a proporção recomendada (16:9) verá a imagem inteira sem corte.

### Texto de orientação

- Uma única frase junto ao campo da capa é suficiente: proporção 16:9 e exemplo em pixels (1200×675). Em português, alinhado ao resto da UI.
