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
| 1. Primeira dobra | APROVADO / REPROVADO / REPROVADO | REPROVADO / APROVADO / REPROVADO | | | | em correção |
| 2. Oferta | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | | | | em correção |
| 3. Prova | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / APROVADO | | | | em correção |
| 4. Conversão | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | | | | em correção |

Rodadas executadas: 2 de 5.

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
