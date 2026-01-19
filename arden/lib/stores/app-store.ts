import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'

/**
 * App-level state interface
 * Contains UI state and application-wide settings
 */
export interface AppState {
  // UI State
  sidebarOpen: boolean
  currentObraId: string | null

  // Loading states
  isLoading: boolean

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setCurrentObra: (obraId: string | null) => void
  setLoading: (loading: boolean) => void
}

/**
 * Default initial state
 */
const initialState = {
  sidebarOpen: true,
  currentObraId: null,
  isLoading: false,
}

/**
 * Creates a new app store instance.
 * Uses createStore from zustand/vanilla for per-request isolation in Next.js App Router.
 *
 * @param preloadedState - Optional partial state to override defaults
 * @returns Zustand store instance
 */
export const createAppStore = (preloadedState?: Partial<AppState>) => {
  return createStore<AppState>()(
    devtools(
      (set) => ({
        ...initialState,
        ...preloadedState,

        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),

        setSidebarOpen: (open) =>
          set({ sidebarOpen: open }, false, 'setSidebarOpen'),

        setCurrentObra: (obraId) =>
          set({ currentObraId: obraId }, false, 'setCurrentObra'),

        setLoading: (loading) =>
          set({ isLoading: loading }, false, 'setLoading'),
      }),
      { name: 'app-store', enabled: process.env.NODE_ENV === 'development' }
    )
  )
}

export type AppStore = ReturnType<typeof createAppStore>
