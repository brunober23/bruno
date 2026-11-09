# Integração do componente de depoimentos (testimonials-3)

## Situação do projeto

O site da Mastio (`site-laudos/`) é **HTML, CSS e JavaScript puros**. Não tem React, Tailwind, TypeScript nem a estrutura do shadcn. O componente `testimonials-3` exige os quatro.

Por isso há duas versões da mesma seção:

- **No site atual** (`index.html`, seção "Depoimentos"): uma porta fiel do componente para HTML e CSS, com o mesmo layout (cards escalonados, linhas nas bordas, ícone "+" decorativo, ícone de aspas, avatar com anel).
- **Nesta pasta** (`react/`): o código React original, pronto para quando o projeto migrar para React.

## Arquivos desta pasta

| Arquivo | Destino no projeto React |
|---|---|
| `components/ui/testimonials-3.tsx` | `components/ui/testimonials-3.tsx` |
| `components/ui/avatar.tsx` | `components/ui/avatar.tsx` (é o `shadcn/avatar`) |
| `lib/utils.ts` | `lib/utils.ts` (o `cn` que os dois componentes importam) |
| `demo.tsx` | página ou rota onde o componente aparece |

## Por que a pasta `/components/ui` importa

O shadcn/ui usa `components/ui` como convenção. Três coisas dependem dela:

1. O comando `npx shadcn@latest add avatar` grava os componentes nessa pasta.
2. O alias `@/components/ui/...`, usado nos imports (`@/components/ui/avatar`), aponta para ela. Em outro caminho, os imports quebram.
3. O arquivo `components.json` registra esse caminho. Sem ele, o CLI não sabe onde instalar.

Se o seu projeto usa `src/`, o caminho padrão passa a ser `src/components/ui`, e o alias `@` deve apontar para `src`.

## Como preparar o projeto (React + TypeScript + Tailwind + shadcn)

1. Criar o projeto com Vite:

```bash
npm create vite@latest mastio-site -- --template react-ts
cd mastio-site
npm install
```

2. Instalar o Tailwind CSS e o plugin do Vite:

```bash
npm install tailwindcss @tailwindcss/vite
```

3. No `src/index.css`, trocar o conteúdo por:

```css
@import "tailwindcss";
```

4. No `vite.config.ts`, registrar o plugin e o alias `@`:

```ts
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
});
```

5. No `tsconfig.json` e no `tsconfig.app.json`, dentro de `compilerOptions`:

```json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

6. Iniciar o shadcn e aceitar o caminho `src/components/ui`:

```bash
npx shadcn@latest init
```

7. Copiar os arquivos desta pasta para `src/` e instalar as dependências:

```bash
npm install @radix-ui/react-avatar clsx tailwind-merge
```

## Perguntas do guia, respondidas

- **Quais dados entram no componente?** Uma lista com `quote`, `name`, `role`, `company` e `image`, definida no topo de `testimonials-3.tsx`.
- **Há estado ou contexto?** Não. É um componente de apresentação, sem estado, sem contexto e sem hooks.
- **Quais assets são necessários?** Uma foto por cliente (campo `image`). Sem foto, o `AvatarFallback` mostra a inicial do nome.
- **Como é a resposta a telas pequenas?** Uma coluna no celular. Três colunas escalonadas (cada card 3rem mais baixo que o anterior) a partir de 768px.
- **Onde usar?** Entre os serviços e o rodapé, como na página atual.

## Dados de exemplo

O código original trazia citações inventadas atribuídas a pessoas reais (executivos de empresas conhecidas). Isso não deve ir para um site de empresa, então os três depoimentos estão como **texto de exemplo**, com nome, cargo e empresa genéricos.

Antes de publicar, troque pelos depoimentos reais de clientes, com a autorização deles. As fotos de avatar ficaram vazias de propósito: um retrato de banco de imagens ao lado de um depoimento daria a impressão de um cliente real que não existe.


---

# Grade interativa de fundo (interactive-grid)

Componente: `components/ui/interactive-grid.tsx`. Demo: `interactive-grid-demo.tsx`.

## No site atual

O fundo claro das seções "Serviços prestados" e "Depoimentos" usa uma porta em JavaScript puro do mesmo componente: as células da grade (40px) acendem sob o cursor e apagam devagar atrás dele, como um rastro. A grade acompanha o ponteiro sobre a seção inteira e não bloqueia cliques no conteúdo.

## Em um projeto React

- **Dependências:** nenhuma além do `cn` de `lib/utils.ts` e do Tailwind. Sem pacotes extras e sem ícones.
- **Props:** `cellSize` (padrão 40) e as props de um `<svg>`.
- **Estado:** interno (tamanho da grade e célula ativa). Sem contexto nem hooks externos.
- **Assets:** nenhum.
- **Responsivo:** a grade recalcula colunas e linhas sempre que o pai muda de tamanho, via `ResizeObserver`.
- **Onde usar:** dentro de um elemento com `position: relative` (ou `sticky`), como fundo de uma seção.
- **Cor:** as células usam a cor do texto (`text-foreground`). Sobre fundo claro ficam escuras e discretas.
- **Movimento reduzido:** com `prefers-reduced-motion`, as células trocam de estado sem transição.
