# Critérios de qualidade — extraídos de mercury.com

Cada regra é um mecanismo verificável no resultado renderizado (screenshots em 1440×900 e 390×844).

1. **Uma ação cromática por tela.** O cobalto (#4885E8) aparece em no máximo um elemento por viewport (o CTA principal). Todo o resto é grafite, ivory e ash. Nenhum verde, vermelho ou laranja de interface.
2. **Hero fotográfico de ponta a ponta.** Primeira dobra = 100vw × 100vh dominada pela foto, que funde com o canvas #171721 por gradiente (sem cantos duros), com um bloco de texto único (título → subtítulo → botões) e uma faixa discreta de aviso de 12px colada na base. Nada de cards na primeira dobra. (Revisado na rodada extra: a foto do engenheiro é vertical, então o texto fica à esquerda e a foto à direita, em vez de centralizado sobre foto horizontal.)
3. **Título grande, corpo contido.** O título do hero tem pelo menos 3,5× o tamanho do corpo (≥ 56px no desktop contra 16px); peso 480, nunca ≥ 600. Só duas famílias de tamanho no miolo das seções: título de seção (28–42px) e corpo (16–18px).
4. **Espaço vazio generoso.** No mínimo 72px de respiro vertical entre blocos e 40%+ da área de cada viewport de seção sem conteúdo. Conteúdo limitado a 1200px, nunca encostado nas bordas.
5. **Separação por valor, não por sombra.** Superfícies só em #171721 (canvas) e #1e1e2a (cards, raio 12px, padding 32px); zero box-shadow, zero borda grossa; divisão de listas por linhas de 1px.
6. **Controles em pílula.** Todo botão, tag, input e item de navegação tem raio ≥ 32px; secundário é sempre outline ivory 1px com texto ivory.
7. **Movimento calmo e sempre na mesma direção.** Revelações sobem (translateY ≤ 32px → 0) com fade; easing de desaceleração longa; nenhuma animação dura menos de 400ms; sem bounce, sem rotação, sem piscar. A nav começa transparente sobre a foto e vira vidro fosco escuro ao rolar.
