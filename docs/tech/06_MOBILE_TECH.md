# Mobile (App) - ARDEN FVS

## Stack Completa

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Expo (React Native) |
| Linguagem | TypeScript |
| Navegacao | React Navigation |
| Estado Global | Zustand |
| Formularios | React Hook Form + Zod |
| Camera | expo-camera + expo-image-manipulator |
| Offline | SQLite (expo-sqlite) + expo-file-system |
| Build/Deploy | EAS Build ($29/mes) |

---

## Expo (React Native Framework)

### Razoes da Escolha

- Performance nativa real (nao e PWA)
- Dev solo friendly (zero config Android Studio/Xcode)
- Build na nuvem (EAS Build)
- Testes sem device fisico (Expo Go)
- SQLite nativo para offline robusto
- Gestos fluidos (60fps)
- Documentacao excelente

### Por que NAO PWA

- Performance insuficiente para 50+ verificacoes offline
- Swipes web nao sao fluidos como nativos
- IndexedDB menos confiavel que SQLite
- UX nao-nativa perceptivel

### Por que NAO React Native Bare

- Complexidade alta para dev solo
- Requer device fisico para testes
- Build local complexo

### Custo

| Item | Valor |
|------|-------|
| EAS Build | $29/mes |
| Google Play Store | $25 (unico) |
| **Total Ano 1** | ~$373 |

### Plataformas

| Fase | Plataforma |
|------|------------|
| MVP | Android |
| Fase 2 | iOS ($99/ano Apple Developer) |

---

## Zustand (Estado Global)

Mesma biblioteca do web para consistencia.

```typescript
// store.ts (mobile)
import { create } from 'zustand'

export const useStore = create((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Verificacoes offline
  verificacoesOffline: [],
  addVerificacao: (v) => set(state => ({
    verificacoesOffline: [...state.verificacoesOffline, v]
  })),

  // Sync status
  syncStatus: 'idle', // idle | syncing | error | success
  setSyncStatus: (status) => set({ syncStatus: status })
}))
```

---

## React Navigation

**Decisao automatica** - Padrao oficial do Expo.

Suporta:
- Stack Navigator
- Tab Navigator
- Drawer Navigator

---

## Camera e Imagens

### Stack

1. **expo-camera** - Tira foto
2. **expo-image-manipulator** - Comprime + Watermark
3. **expo-file-system** - Salva no filesystem local
4. **SQLite** - Armazena referencia (path)
5. **Supabase Storage** - Upload quando sincronizar

### Watermark Automatico

- Nome da obra
- Data e hora
- Nome do inspetor
- Coordenadas GPS (se disponivel)

### Compressao

- Quality: 0.8
- Tamanho alvo: ~800KB
- Formato: JPEG

### Edicao de Fotos (Fase 2)

- Circulos, setas, desenho livre
- Biblioteca: react-native-sketch-canvas
- **Adiado** - Nao critico para MVP

---

## React Hook Form + Zod

Mesma stack do web para consistencia.

**Particularidade Mobile:** Usa `Controller` do RHF (necessario para TextInput do React Native).

```typescript
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const verificacaoSchema = z.object({
  observacao: z.string().min(3, 'Minimo 3 caracteres'),
  status: z.enum(['conforme', 'nao_conforme'])
})

// No componente
const { control, handleSubmit } = useForm({
  resolver: zodResolver(verificacaoSchema)
})

<Controller
  control={control}
  name="observacao"
  render={({ field: { onChange, value } }) => (
    <TextInput value={value} onChangeText={onChange} />
  )}
/>
```

---

## Workflow de Desenvolvimento

1. Desenvolvimento local (VS Code)
2. Testa via **Expo Go** (QR Code)
3. Codigo roda instantaneamente no fisico
4. Build final via EAS Build (cloud)
5. Publica via EAS Submit → Google Play Store

---

## Principios

- Consistencia com web (mesmas ferramentas)
- Offline-first robusto (SQLite nativo)
- Zero ambiguidade (regras claras de sync)
- Performance nativa (nao PWA)

---

## Referencias

- Sincronizacao: [04_OFFLINE_SYNC.md](04_OFFLINE_SYNC.md)
- Arquitetura: [01_ARCHITECTURE.md](01_ARCHITECTURE.md)
