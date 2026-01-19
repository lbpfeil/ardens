'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createAppStore, type AppStore, type AppState } from './app-store'

/**
 * Context for the app store
 * Null when not within a StoreProvider
 */
const AppStoreContext = createContext<AppStore | null>(null)

interface StoreProviderProps {
  children: ReactNode
  initialState?: Partial<AppState>
}

/**
 * Provider component that creates and provides the app store to children.
 * Uses useRef to ensure the store is created only once per component lifecycle.
 *
 * @param children - React children to render
 * @param initialState - Optional initial state to preload
 */
export function StoreProvider({ children, initialState }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = createAppStore(initialState)
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  )
}

/**
 * Hook to access the app store with a selector.
 * Must be used within a StoreProvider.
 *
 * @param selector - Function to select specific state
 * @returns Selected state value
 * @throws Error if used outside StoreProvider
 *
 * @example
 * // Select single property
 * const sidebarOpen = useAppStore((state) => state.sidebarOpen)
 *
 * // Select action
 * const toggleSidebar = useAppStore((state) => state.toggleSidebar)
 */
export function useAppStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(AppStoreContext)

  if (!store) {
    throw new Error('useAppStore must be used within StoreProvider')
  }

  return useStore(store, selector)
}
