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
| 1. Primeira dobra | APROVADO / REPROVADO / REPROVADO | REPROVADO / APROVADO / REPROVADO | APROVADO / REPROVADO / APROVADO | APROVADO / REPROVADO / APROVADO | APROVADO / REPROVADO / APROVADO | **pausada no limite** |
| 2. Oferta | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / APROVADO | **APROVADO / APROVADO / APROVADO** | — | **aprovada** |
| 3. Prova | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / APROVADO | APROVADO / REPROVADO / APROVADO | **APROVADO / APROVADO / APROVADO** | — | **aprovada** |
| 4. Conversão | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | **APROVADO / APROVADO / APROVADO** | — | **aprovada** |

Rodadas executadas: 5 de 5 (limite atingido). As peças 2, 3 e 4 foram aprovadas pelos três críticos. A peça 1 tem Briefing e Visual aprovando, e o Sistema ainda reprova. O ciclo está pausado, e a decisão de continuar é do cliente.

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

### Rodada 4
As peças 2 (Oferta), 3 (Prova) e 4 (Conversão) foram aprovadas pelos três críticos e não voltam mais ao Construtor. Na comparação cega, o Visual preferiu o novo site nas 4 peças.
- **Primeira dobra:** reprovada só pelo Sistema. A 2ª linha do H1 está em lichen (#6d6e5e), e o sistema define títulos serifados em #000. O lichen tinha sido uma instrução da própria rodada 2.
  - Refinos do Visual: centralizar os links da nav no eixo da página (hoje estão 26px fora) e deixar o parallax do orbe perceptível (hoje ~11px).
  - Nota do Briefing: a imagem OG não combina com o hero. Correção: `og-uilook.jpg` gerada com o orbe sobre o quadriculado.
- **Refinos registrados para depois, sem reprovação:**
  - Cartão 02 de Serviços com título e texto desconectados no desktop.
  - Foto do MLP de banco de imagens. Seria melhor usar telas reais do trabalho.
  - Exposição desigual entre fotos (Contato mediana 246 contra 147).
  - Base do rodapé desalinhada.
  - CTA do desktop sem a palavra WhatsApp.
  - Barra do celular sem fio quando passa sobre o Diagnóstico.
- **Interrupção:** os críticos foram interrompidos pelo limite de uso e retomados depois.

### Rodada 5 (limite atingido)
- **Primeira dobra:** Briefing APROVADO, Visual APROVADO (melhor que o original) e Sistema REPROVADO.
  - Principal lacuna do Sistema: o hero não tem o par de botões cheio + contorno ("two-button cluster"). O formulário tem só "Enviar".
  - Outras alegações do Sistema:
    - Subtítulo com palavras em ink: é a ênfase por cor, decisão da rodada 2, aceita por Sistemas anteriores.
    - Tagline "product delivery" no logo: é da marca original.
    - Separadores "·" na faixa de ferramentas.
  - Refinos do Visual: separadores pretos fortes demais na faixa e máscara de borda estreita (corte "Ado|b"). H1 4,5px à direita do eixo por causa do tracking negativo.
- **Verificação:** as peças congeladas (2–4) ficaram idênticas. O diff da rodada 5 mexe só em `<head>`, hero e nav.
