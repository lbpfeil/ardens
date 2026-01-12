# Design System - ARDEN FVS

## SSOT

O arquivo **`DESIGN-SYSTEM.md`** na raiz do projeto e a fonte de verdade para UI/UX.

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

- Design System: `DESIGN-SYSTEM.md` (raiz)
- Navegacao: [../product/04_NAVIGATION.md](../product/04_NAVIGATION.md)
- Stack Web: [../tech/05_FRONTEND_WEB.md](../tech/05_FRONTEND_WEB.md)
