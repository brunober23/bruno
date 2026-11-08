# Progresso — Ciclo de Design (loop-design-qa)

**Referência:** mercury.com · **Sistema:** design-system-felipe · **Limite:** 3 rodadas
**Modelos:** Construtor = Sonnet · Crítico do Briefing = Opus · Crítico do Sistema = Sonnet · Crítico Visual = Opus

| Peça | Rodada 1 (B / S / V) | Rodada 2 | Rodada 3 | Rodada extra 4 | Status |
|---|---|---|---|---|---|
| 1. Hero + nav | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | REPROVADO / REPROVADO / REPROVADO | pausado |
| 2. Credibilidade | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / REPROVADO | REPROVADO / REPROVADO / REPROVADO | pausado |
| 3. Soluções | APROVADO / REPROVADO / REPROVADO | APROVADO / REPROVADO / APROVADO | APROVADO / REPROVADO / APROVADO | REPROVADO / REPROVADO / REPROVADO | pausado |

Rodadas executadas: 3 de 3 + 1 rodada extra autorizada (4 no total). Nenhuma peça tem os três críticos aprovando; o ciclo está pausado e a decisão de continuar é sua.

## Histórico das principais lacunas

### Rodada 1
- **Hero:** foto virou borrão azul-escuro por overlay uniforme (Visual); nav e botões em 14px/420 em vez de 16px/400 (Sistema); título cobrindo a foto; CTAs duplicados entre nav e hero. Corrigido: gradiente leve, texto no alto com o assunto da foto visível embaixo, botões 16px/400, nav com texto e destino próprios.
- **Credibilidade:** três cards idênticos sem foco e linha de 1px dentro dos cards (Visual); grade decorativa no canvas, rótulo 18px/420 e título de selo 420 (Sistema); normas NBR e nome do IBAPE escondidos no acordeão (Briefing). Corrigido: bento com um número em destaque, sem linha e sem grade, subtítulo dos selos sempre visível.
- **Soluções:** captura não mostrava o rodapé (Visual); micro-CTAs em 14px, tags com tracking 6× o valor do sistema, rodapé herdando 16px e padding de 28px fora da escala (Sistema). Corrigido: CTAs 16px, tags 0.12px, rodapé 12px/480 com 32px, e a captura agora inclui o fim da página.
- **Não aplicado de propósito:** encurtar o H1 e os rótulos dos botões (o texto é fixado pelo cliente).

### Rodada 2
- **Hero:** foto passava "imóvel com problema" e o céu azul saturado competia com o cobalto; pontas dos acentos do título apareciam no frame de 300ms; vidro da nav com blur 24px e saturate fora do sistema; eyebrow e "Role para explorar" em caixa-alta com tracking largo. Corrigido: foto da fachada com camada desfocada e gradiente onyx atrás do texto, máscara da animação mais funda, nav com blur 20px, microcopy sem caixa-alta.
- **Credibilidade:** bento sem foco e metade direita do cabeçalho vazia (Visual); título dos selos em ash e ritmo de 56px (Sistema). Corrigido: cartão ilustrativo de laudo no lado direito, métricas em linha com divisórias de 1px, títulos em ivory, 72px de ritmo.
- **Soluções:** faixa escura no topo da foto do card 3 (parallax), fotos sem tratamento único, 128px antes do rodapé, eyebrow fora do sistema (Sistema/Visual). Corrigido: moldura sempre coberta, mesma dessaturação e overlay nas três fotos, 72px, eyebrow sem caixa-alta.

### Rodada 3 (limite atingido)
- **Hero** — Sistema e Visual reprovaram. Principal lacuna: a foto. O desfoque em manchas na metade de cima parece imagem quebrada e a paleta é quente e saturada em vez de fria. Também: nav sem links no mobile, blur(12px) no aviso e raio 0 na nav rolada.
- **Credibilidade** — Sistema e Visual reprovaram. Principal lacuna (Visual): o cartão de laudo parece wireframe e há mais de dois tamanhos de texto. Sistema: divisórias e anéis em cores translúcidas fora dos tokens, subtítulos dos selos com ash reduzido por opacidade.
- **Soluções** — Visual aprovou; Sistema reprovou. Lacuna: as fotos dos cards não têm o mesmo tratamento (a foto 03 fica clara e saturada, as 01 e 02 escuras e quentes).
- **Decisões que não aplicaria sem confirmação:** inventar número de laudo, endereço e ART no cartão ilustrativo (seriam dados falsos); encurtar o H1 e os botões (texto fixado pelo cliente).

### Rodada extra 4 (nome Mastio, WhatsApp real, foto do engenheiro)
- **Hero** — os três reprovaram. Principais: emenda vertical dura onde a foto encontra o canvas (desktop) e cortes horizontais no mobile; nav mobile em duas linhas, de borda a borda; H1 de 56px fora dos tokens (49 ou 65). A alegação de "foto espelhada" foi verificada e é falsa: os frames de 300ms e 1200ms são idênticos e o adesivo do capacete já vem invertido na foto original.
- **Credibilidade** — os três reprovaram. Principais: no mobile os indicadores só aparecem após rolar uma tela inteira; normas quebram deixando "NBR 16280" órfã; cartão de foto fino, escuro e quente, a 88px (não 72px) das métricas, desalinhado do container.
- **Soluções** — Briefing aprovou; Sistema e Visual reprovaram. Principais: as três fotos ainda não têm a mesma tonalidade (a de Perícia é ~4x mais saturada/azul); pílula da nav encostando nas bordas no mobile.
- **Comum às três peças:** pílula da nav no mobile sem margem lateral; tratamento frio das fotos.
- **Não aplicado de propósito:** inventar dados de laudo; trocar os micro-CTAs por links de texto; foto sem padding no card.
