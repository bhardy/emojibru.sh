import { atom, selector } from 'recoil'

const initialState = {
  paintingState: {
    grid: [],
    width: 10,
    height: 8,
  },
  toolState: {
    type: 'draw',
    paint: '👾',
    alternatePaint: '🦄'
  },
  paletteState: ['🙈', '😭', '😕', '🤠', '😌', '🧞', '😂', '🤬', '😝', '💩', '🤢', '😫'],
  allowShortcutsState: true,
}

export const paintingState = atom({
  key: 'paintingState',
  default: initialState.paintingState,
  persistence_UNSTABLE: {
    type: 'url'
  },
})

export const toolState = atom({
  key: 'toolState',
  default: initialState.toolState,
  persistence_UNSTABLE: {
    type: 'url'
  },
})

export const paletteState = atom({
  key: 'paletteState',
  default: initialState.paletteState,
  persistence_UNSTABLE: {
    type: 'url'
  },
})

export const allowShortcutsState = atom({
  key: 'allowShortcutsState',
  default: initialState.allowShortcutsState
})

export const appState = selector({
  key: 'appState',
  get: ({ get }) => {
    const painting = get(paintingState)
    const palette = get(paletteState)
    const tool = get(toolState)

    return {
      painting,
      palette,
      tool
    }
  }
})

export const initializeState = ({ set }) => {
  const keys = ['paintingState', 'paletteState', 'toolState']
  keys.forEach((key) => {
    const item = localStorage.getItem(key)
    const parsed = JSON.parse(item)
    if (parsed) {
      set({ key }, parsed.value)
    }
  })
}
