# Design System - ARDEN FVS

## Regras para Desenvolvimento com IA

> **IMPORTANTE**: Ao solicitar criacao de UI para a IA, inclua estas instrucoes no prompt:

```
Siga as regras de desenvolvimento em @docs/design/README.md
```

### Regras Obrigatorias

1. **DESIGN-SYSTEM.md e a fonte de verdade** - Consulte `@docs/design/DESIGN-SYSTEM.md` para cores, tipografia, espacamentos e padroes de componentes

2. **Use APENAS componentes shadcn existentes** - Os componentes estao em `@arden/components/ui` (Button, Card, Input, Select, etc.). NAO crie novos componentes UI

3. **Use variaveis CSS do globals.css** - Prefira classes como `bg-surface-100`, `text-foreground-light`, `border-border` ao inves de valores hardcoded como `bg-gray-800`

4. **NAO crie abstracoes desnecessarias** - Evite criar wrappers como `HeroSection.tsx`, `FeatureCard.tsx`. Prefira composicao inline com Tailwind

5. **Pergunte antes de criar** - Se precisar de um componente que nao existe, pergunte ao usuario antes de implementar

### Variaveis CSS Principais

```
Backgrounds: bg-background, bg-surface-100, bg-surface-200, bg-overlay
Texto:       text-foreground, text-foreground-light, text-foreground-lighter, text-foreground-muted
Bordas:      border-border, border-strong, border-overlay
Brand:       bg-brand, text-brand, text-brand-link
Estados:     bg-destructive, bg-warning, bg-accent
```

### Exemplo de Prompt

```
Crie a landing page do Arden FVS.

Siga as regras de desenvolvimento em @docs/design/README.md

A landing deve ter:
- Hero com titulo, subtitulo e CTA
- Secao de features (3 cards)
- Footer simples
```

---

## SSOT

O arquivo **`DESIGN-SYSTEM.md`** nesta pasta e a fonte de verdade para UI/UX.

---

## O que Contem o DESIGN-SYSTEM.md

- Paleta de cores (dark mode)
- Tipografia
- Espacamentos
- Componentes UI
- Layouts
- Acessibilidade
- Padroes de interacao

---

## Inspiracao

Baseado no design system do **Supabase** (ferramenta open-source de backend-as-a-service).

### Caracteristicas
- Dark mode nativo (padrao unico)
- React + Tailwind CSS + Radix UI
- Acessibilidade (WCAG)
- Estetica profissional

---

## Quando Usar

### Antes de Criar UI
1. Consulte `DESIGN-SYSTEM.md` para padroes existentes
2. Use componentes ja definidos
3. Nao invente novos padroes sem necessidade

### Quando Precisar de Algo Novo
1. Verifique se nao existe algo similar
2. Siga os tokens de design existentes
3. Documente o novo componente no DESIGN-SYSTEM.md

---

## Split Futuro (Opcional)

Se `DESIGN-SYSTEM.md` ficar muito grande (>500 linhas), considerar split em:

- `docs/design/TOKENS.md` - Cores, tipografia, espacamentos
- `docs/design/COMPONENTS.md` - Componentes UI
- `docs/design/LAYOUTS.md` - Layouts e navegacao
- `docs/design/ACCESSIBILITY.md` - Padroes de acessibilidade

**Status atual:** DESIGN-SYSTEM.md e suficiente.

---

## Referencias

- Design System: [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)
- Navegacao: [../product/04_NAVIGATION.md](../product/04_NAVIGATION.md)
- Stack Web: [../tech/05_FRONTEND_WEB.md](../tech/05_FRONTEND_WEB.md)
