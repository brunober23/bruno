# Critérios de qualidade — UiLook redesign

Referências: o site atual (https://uilook.framer.website/), de onde vêm o conteúdo e a ordem
das seções, e o sistema de design UILook oficial (`sistema-de-design.md`: catálogo editorial em
papel creme), de onde vem a linguagem visual. Cada regra abaixo é um mecanismo que dá para
checar olhando o resultado renderizado (capturas em 1440×900 e 390×844 e sequências de quadros
durante a rolagem).

1. **Contraste entre duas famílias, nunca uma terceira.** Títulos são serifados finos (peso 300)
   e o H1 do hero tem pelo menos 6× o tamanho do corpo no desktop (≥ 88px contra 14–16px) e
   ≥ 44px no celular. O serifado nunca aparece abaixo de 24px. Todo o resto (nav, botões,
   rótulos, corpo, formulários, rodapé) é monoespaçado de 12–16px. Toda seção tem um rótulo
   mono de 12px em caixa-alta acima do título.

2. **Um único roxo, como marca-texto.** O #2D0567 (ou #a68ce0 sobre carbono) aparece no máximo 4 vezes por viewport e
   só como traço de 2–6px ou bloco pequeno (≤ 120px de largura) ou sublinhado/realce atrás de
   uma palavra. Nunca como cor de texto, fundo de seção ou preenchimento de botão. Todo o resto
   é tinta, carbono e oliva-sálvia quentes sobre creme #f6f6f4. Nenhum cinza frio ou azul.

3. **Plano como papel impresso.** Zero sombra e zero gradiente nas superfícies. A separação vem
   só de fios de 1px (#d0d0c8 ou #57584b) e do contraste creme ↔ carbono #2c2c26. Raio de 8px
   nos cartões e de 3px em botões, tags, campos e nav. O botão cheio é sempre carbono com texto
   branco, e o secundário é sempre contorno preto de 1px.

4. **O espaço vazio é a estrutura.** No desktop há ≥ 80px entre seções (≥ 56px no celular), o
   conteúdo cabe em 1200px e nunca encosta na borda (gutter ≥ 16px no celular). Pelo menos 35%
   da primeira dobra no desktop fica sem conteúdo. A primeira dobra mostra H1, subtítulo e o
   formulário de captação (Email + WhatsApp + Enviar) sem rolar, em 1440×900.

5. **A página se revela enquanto rola.** Cada bloco de seção entra quando aparece no viewport,
   com fade e subida de 16–32px, ou revelação por máscara linha a linha nos títulos serifados.
   As revelações duram 600–1100ms, desaceleram no fim, sobem sempre na mesma direção e irmãos
   entram em cascata de 60–140ms. Nada pisca, quica ou gira. Há ao menos 4 movimentos ligados
   à rolagem ou à interação além do fade: parallax do visual do hero, contagem dos números,
   acordeão do FAQ com altura animada, faixa de ferramentas em loop e cartões ou passos com
   pin/sticky. Os hovers respondem em 150–300ms (preenchimento de botão, fio do cartão
   escurecendo, sublinhado de link). Com `prefers-reduced-motion` tudo aparece estático e
   visível.

6. **Imagem editorial, um só tratamento.** Todas as fotos usam o mesmo tratamento: dessaturadas,
   quentes e claras, com o mesmo filtro, proporção fixa (1:1, 4:3 ou 3:4), raio de 8px e fio de
   1px. O visual do hero é um objeto 3D sobre quadriculado de transparência, com barras de
   acento preta (2px) e roxa (4px). Nenhuma foto aparece crua e saturada ao lado de outra
   tratada.

7. **Responsivo sem concessão.** Em 390px não há rolagem horizontal. Nenhuma palavra do H1 é
   cortada no meio. Alvos de toque têm ≥ 44px. A nav vira menu compacto. Grades de 3 colunas
   viram 1 coluna e grades de 4 viram 2 ou 1, mantendo a mesma hierarquia tipográfica. O botão
   flutuante de WhatsApp não cobre conteúdo nem botões.
