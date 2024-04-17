import { create } from 'zustand'
import { auth } from '../helper-plugin'
import io, { Socket } from 'socket.io-client'

interface IMenu {
  key: string
  label: string
  path: string
  viewable: boolean
  creatable: boolean
  exportable: boolean
}

interface ISchemas {
  layouts: ILayouts
  settings: Record<string, any>
  uid: string
}

interface IAppState {
  socket?: Socket
  isAuthorized: boolean
  isSuperAdmin?: boolean
  menu?: Array<IMenu>
  layouts?: Map<string, ILayouts>
  login: () => void
  logout: () => void
  setIsSuperAdmin: (value?: boolean) => void
  setMenu?: (menu: Array<IMenu>) => void
  setSchemas?: (schemas: Array<ISchemas>) => void
  socketInit: () => void
  onSocket: (name: string, onAction: (val: any) => void, onActionStop?: (val: any) => void) => any
  emitSocket: <T>(name: string, value: T) => any
}

export const useAppStore = create<IAppState>((set, get) => ({
  isAuthorized: auth.getToken() !== null && auth.getToken() !== undefined,
  login: () => set(() => ({ isAuthorized: true })),
  logout: () => set(() => ({ isAuthorized: false })),
  setIsSuperAdmin: (isSuperAdmin) => set((state) => ({ ...state, isSuperAdmin })),
  setMenu: (menu) => set((state) => ({ ...state, menu })),
  setSchemas(schemas) {
    const layouts = new Map()
    schemas.forEach((s) => {
      layouts.set(s.uid, s.layouts)
    })
    set((state) => ({ ...state, layouts }))
  },
  socketInit: () => {
    const socket = io('https://be.sellfastusdt.com/socket')
    set((state) => ({ ...state, socket }))
  },
  onSocket: <T>(name: string, onAction: (val: T) => void, onActionStop?: (val: T) => void) => {
    const socket = get().socket
    socket?.on(name, (val: T) => {
      onAction(val)
    })
    return () => {
      socket?.off(name, (val: T) => {
        onActionStop ? onActionStop(val) : onAction(val)
      })
    }
  },
  emitSocket: <T>(name: string, value: T) => {
    const socket = get().socket
    socket?.emit(name, value)
  }
}))
