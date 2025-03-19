import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Painting, Tool } from '@/types'

interface Store {
  // Painting state
  painting: Painting
  setPainting: (update: Partial<Painting>) => void
  resetPainting: () => void

  // Tool state
  tool: Tool
  setTool: (update: Partial<Tool>) => void

  // Palette state
  palette: string[]
  setPalette: (index: number, paint: string) => void

  // EmojiPicker state
  showPicker: boolean
  setShowPicker: (show: boolean) => void

  // Edit Palette state
  editPaletteMode: boolean
  setEditPaletteMode: (edit: boolean) => void

  // Small screen toolbar state
  showExpandedToolbar: boolean
  setShowExpandedToolbar: (show: boolean) => void

  // Touch screen panning state
  touchPanning: boolean
  setTouchPanning: (pan: boolean) => void
}

const initialPainting: Painting = {
  // width: 10,
  // height: 10,
  // grid: [
  //   ['🌨️', '🌨️', '☁️', '☁️', '🌋', '❄️', '❄️', '❄️', '⛈️', '🌩️'],
  //   ['🌤️', '🌨️', '☁️', '🐝', '🗻', '🗻', '❄️', '🌨️', '🦅', '🌩️'],
  //   ['☁️', '🦋', '🌈', '⛰️', '⛰️', '🚠', '⛰️', '🌨️', '🌨️', '🌩️'],
  //   ['🌨️', '🌈', '⛰️', '🌲', '⛰️', '⛰️', '⛰️', '⛰️', '⛰️', '🌨️'],
  //   ['⛰️', '⛰️', '🐒', '⛰️', '🦕', '⛰️', '⛰️', '🧗‍♂️', '⛰️', '🦉'],
  //   ['🌴', '🌴', '🌴', '⛰️', '⛰️', '⛰️', '🌴', '⛰️', '⛰️', '⛰️'],
  //   ['🌊', '🌊', '🌊', '⛵️', '🏝️', '🏝️', '🌊', '🌊', '🏊', '🌊'],
  //   ['🌊', '🦈', '🌊', '🌊', '🌊', '🌊', '🌊', '🐳', '🌊', '🌊'],
  //   ['🌊', '🌊', '🌊', '🌊', '🚤', '🌊', '🌊', '🌊', '🌊', '🌊'],
  //   ['🌊', '🌊', '🐙', '🌊', '🌊', '🌊', '🌊', '🧊', '🌊', '🌊'],
  // ],
  width: 16,
  height: 16,
  //prettier-ignore
  grid: [
    ['🌨️','🌨️','☁️','☁️','🌋','❄️','❄️','❄️','⛈️','🌩️','🌨️️','🌨️️','☁️️','☁️️','🌨️️','🌨️️'],
    ['🌤️','🌨️','☁️','🐝','🗻','🗻','❄️','🌨️','🦅','🌩️','🌨️️','☁️️','🌨️️','🌨️️','☁️️','🌨️️'],
    ['☁️','🦋','🌈','⛰️','⛰️','🚠','⛰️','🌨️','🌨️','🌩️','🌨️️','🌨️️','🌨️️','🌨️️','☁️️','🌨️️'],
    ['🌨️','🌈','⛰️','🌲','⛰️','⛰️','⛰️','⛰️','⛰️','🌨️','🌨️️','🌨️️','☁️️','🌨️️','🌨️️','🌨️️'],
    ['⛰️','⛰️','🐒','⛰️','🦕','⛰️','⛰️','🧗‍♂️','⛰️','🦉','⛰️️','🌨️️','🌨️️','🌨️️','🌨️️','🌨️️'],
    ['🌴','🌴','🌴','⛰️','⛰️','⛰️','🌴','⛰️','⛰️','⛰️','⛰️️','⛰️️','⛰️️','⛰️️','☁️️','☁️️'],
    ['🌊','🌊','🌊','⛵️','🏝️','🏝️','🌊','🌊','🏊','⛰️️','⛰️️','⛰️️','⛰️️','🌊️','🌊️','🌊️'],
    ['🌊','🦈','🌊','🌊','🌊','🌊','🌊','🐳','🌊','🌊','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️'],
    ['🌊','🌊','🌊','🌊','🚤','🌊','🌊','🌊','🌊','🌊','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️'],
    ['🌊','🌊','🐙','🌊','🌊','🌊','🌊','🧊','🌊','🌊','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️'],
    ['🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️'],
    ['🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️'],
    ['🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️'],
    ['🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️'],
    ['🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','😝️','😝️','😝️','🌊️'],
    ['🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️','🌊️']
  ],
}

const useStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        // Painting state
        painting: initialPainting,
        setPainting: (update) => {
          set((state) => {
            const newPainting = {
              ...state.painting,
              ...update,
            }
            return { painting: newPainting }
          })
        },
        resetPainting: () => {
          set((state) => ({
            painting: {
              ...state.painting,
              grid: [],
            },
          }))
        },
        // Tool state
        tool: {
          type: 'draw',
          paint: '🧞',
          alternatePaint: '👾',
        },
        setTool: (update) =>
          set((state) => ({
            tool: {
              ...state.tool,
              ...update,
            },
          })),
        // Palette state
        palette: [
          '🙈',
          '😭',
          '😕',
          '🤠',
          '😌',
          '🧞',
          '😂',
          '🤬',
          '😝',
          '💩',
          '🤢',
          '😫',
        ],
        setPalette: (index, paint) =>
          set((state) => {
            const newPalette = [...state.palette]
            newPalette[index] = paint
            return { palette: newPalette }
          }),
        // EmojiPicker state
        showPicker: false,
        setShowPicker: (show) => {
          set((state) => ({
            showPicker: show,
            // only show picker or edit pallette, not both
            editPaletteMode: show ? false : state.editPaletteMode,
          }))
        },
        // Edit Palette state
        editPaletteMode: false,
        setEditPaletteMode: (edit) => {
          set((state) => ({
            editPaletteMode: edit,
            // only show picker or edit pallette, not both
            showPicker: edit ? false : state.showPicker,
          }))
        },
        // Small screen toolbar state
        showExpandedToolbar: false,
        setShowExpandedToolbar: (show) => {
          set({ showExpandedToolbar: show })
        },
        // Touch screen panning state
        touchPanning: false,
        setTouchPanning: (pan) => {
          set({ touchPanning: pan })
        },
      }),
      {
        // Persists to local storage
        name: 'emoji-brush',
        partialize: (state: Store) => ({
          painting: state.painting,
          tool: state.tool,
          palette: state.palette,
        }),
      },
    ),
  ),
)

export default useStore
