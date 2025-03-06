import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

// @note: may want to rename this after we sync to local storage
const initialPainting = {
  width: 10,
  height: 10,
  grid: [],
}

const useStore = create(
  devtools(
    persist((set) => ({
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
        set({ painting: initialPainting })
      },

      // Tool state
      tool: {
        type: "draw",
        paint: "🧞",
        alternatePaint: "👾",
      },
      setTool: (update) =>
        set((state) => ({
          tool: {
            ...state.tool,
            ...update,
          },
        })),

      // Palette state
      palette: ["🙈", "😭", "😕", "🤠", "😌", "🧞", "😂", "🤬", "😝", "💩", "🤢", "😫"],
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
          // disable shortcuts when picker is shown
          allowShortcuts: !show,
          // only show picker or edit pallette, not both
          editPaletteMode: show ? false : state.editPaletteMode
        }))
      },
      // Edit Plalette state
      editPaletteMode: false,
      setEditPaletteMode: (edit) => {
        set((state) => ({
          editPaletteMode: edit,
          // disable shortcuts in the edit palette state
          allowShortcuts: !edit,
          // only show picker or edit pallette, not both
          showPicker: edit ? false : state.showPicker
        }))
      },
    }), {
      // Cycles to local storage
      name: "emoji-brush",
      partialize: (state) => ({
        painting: state.painting,
        tool: state.tool,
        palette: state.palette,
      })
    })
  )
)

export default useStore
