import { createContext, useContext } from 'react'

export const CDTContext = createContext(null)

export function useCDT() {
  const ctx = useContext(CDTContext)
  if (!ctx) throw new Error('useCDT must be used within CDTContext.Provider')
  return ctx
}
