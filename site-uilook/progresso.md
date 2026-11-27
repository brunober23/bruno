# Progresso — Ciclo de Design (loop-design-qa)

**Objetivo:** redesenhar https://uilook.framer.website/ com o mesmo conteúdo, no sistema de design UILook oficial, responsivo, com animações fluidas na rolagem, SEO melhorado e imagens do Unsplash.
**Referência:** https://uilook.framer.website/ (conteúdo) + `sistema-de-design.md` (linguagem visual) · **Critérios:** `criterios-de-qualidade.md`
**Modelos:** Construtor = Sonnet · Crítico do Briefing = Sonnet · Crítico do Sistema = Haiku · Crítico Visual = Opus
**Limite:** 5 rodadas

## Peças
1. **Primeira dobra:** nav, hero com formulário de captação e faixa de ferramentas
2. **Oferta:** Serviços, Soluções e Diagnóstico (4 passos, R$129,90)
3. **Prova:** MLP, Números, FAQ e Fundador
4. **Conversão:** Contato, rodapé e botão flutuante de WhatsApp. O responsivo e o SEO são avaliados nas quatro peças.

| Peça | Rodada 1 (B / S / V) | Rodada 2 | Rodada 3 | Rodada 4 | Rodada 5 | Status |
|---|---|---|---|---|---|---|
| 1. Primeira dobra | APROVADO / REPROVADO / REPROVADO | REPROVADO / APROVADO / REPROVADO | APROVADO / REPROVADO / APROVADO | | | em correção |
| 2. Oferta | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / APROVADO | | | em correção |
| 3. Prova | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / APROVADO | APROVADO / REPROVADO / APROVADO | | | em correção |
| 4. Conversão | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | | | em correção |

Rodadas executadas: 3 de 5.

## Histórico das principais lacunas

### Rodada 1
Na comparação cega, o Crítico Visual escolheu o novo site como melhor nas 4 peças. Mesmo assim, reprovou as 4 pelos critérios.
- **Primeira dobra:** o visual do hero é um retângulo opaco sobre o quadriculado (Visual). A 2ª linha do H1 está em itálico, há um texto mono de 21px/700 e o tracking do mono é fixo em -0.938px em todos os tamanhos (Sistema). Os nomes da faixa de ferramentas estão em mono 22px, os eyebrows têm dois tamanhos e o "Enviar" está desalinhado dos campos.
  - Correção: orbe 3D do próprio site original convertido para cromado quente com fundo transparente.
- **Oferta:** as fotos têm tons diferentes (sépia, azulada, malva), a pilha sticky de Serviços deixa uma foto vazar na outra, os cartões têm ~230px de vazio e os passos do Diagnóstico entram sem cascata (Visual). Os eyebrows estão em 16px e o corpo usa peso 500 para dar ênfase (Sistema).
- **Prova:** o retrato do fundador é de banco de imagens (Visual).
  - Correção: foto real do site original.
  - O FAQ salta de altura e os botões têm 32px no celular. Os fios dos Números descolam na cascata e a foto do MLP não alinha à grade.
- **Conversão:** o botão flutuante cobre conteúdo e some sobre fundo escuro (Visual). O marca-texto amarelo do rodapé tem 226px (o limite é 120) e há ~104px entre o contato e o rodapé (Sistema). Os títulos de coluna do rodapé são H2 (Briefing).

### Rodada 2
Na comparação cega, o Crítico Visual escolheu o novo site como melhor nas 4 peças de novo.
- **Primeira dobra:** reprovada pelo Briefing e pelo Visual. O link do logo tem 79×24px no celular. O loop de ferramentas corta letras nas bordas, sem esmaecimento. O alt do orbe ainda fala em "reflexos quentes".
- **Oferta:** reprovada pelo Sistema e pelo Visual. Serviços e Soluções repetem o mesmo trio com listas quase iguais, cerca de 2.400px de redundância, e Soluções precisa de outra forma. O hover do botão cheio quase não aparece. As fotos estão escuras, e o sistema pede dessaturadas e *high-key*.
  - O Sistema alegou que a foto de banco era proibida. Isso foi descartado: as imagens do Unsplash são um pedido explícito do cliente. O botão branco sobre carbono também foi descartado: é a variante do rodapé prevista no próprio sistema.
- **Prova:** reprovada só pelo Sistema. Os 4 botões do FAQ têm raio 0 e os títulos de cartão 32px têm line-height 1.2. O Visual pediu, sem reprovar, para alinhar a grade do Fundador e evitar a palavra órfã no H2 de Números no celular.
- **Conversão:** reprovada pelo Sistema e pelo Visual. No desktop não há CTA fixo, porque o botão flutuante não aparece. A foto do Contato tem proporção 2,07:1 e muda entre telas. O rodapé no celular tem 80px de padding inferior, e o sistema pede 64px.

### Rodada 3
O Briefing aprovou as 4 peças e o Visual aprovou as peças 1, 2 e 3. O Sistema reprovou as 4.
- **Conversão:** o Visual reprovou porque, no celular, o botão flutuante (42×42) fica dentro da coluna e cobre o título "Experiência do usuário (UX)". Correção: barra fixa inferior no celular, com espaço reservado.
- **Sistema:**
  - Fotos escuras: luminância média de 88 a 113, e o sistema pede *high-key*. Meta: ≥ 150 em cada foto, com o mesmo tratamento monocromático. O tratamento único foi mantido por causa do critério 6.
  - Botões com 44–48px, contra o padding 8×16 do sistema (~37px). Conflito com o alvo de toque de 44px do critério 7. Decisão: padding do sistema no desktop e mínimo de 44px só em telas de toque.
  - Barra direita do hero sem amarelo.
  - H1 de 48px no celular, contra 64–96 no sistema.
  - Cabeçalho de Soluções alinhado à esquerda. Será centralizado. O Contato fica como layout dividido, que o sistema permite.
  - Ícones do fundador em preto. Passam para lichen.
- **Refinos do Visual, sem reprovação:**
  - Pilha de Serviços cortando frase e recuos desiguais.
  - Linhas de ~95 caracteres na bio.
  - "36" fora do recuo da grade de Números.
  - Foto do Contato empurrando o formulário no celular.
  - Rodapé desorganizado.
- **Captura:** os quadros `m-fab-*` e `d-faq-0` mostraram a seção errada por conflito com o Lenis. O script foi corrigido.
