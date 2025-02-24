import { create } from "zustand";
import { devtools } from "zustand/middleware";

// @note: may want to rename this after we sync to local storage
const initialPainting = {
  width: 10,
  height: 10,
  grid: [],
};

const useStore = create(
  devtools((set) => ({
    // Painting state
    painting: initialPainting,
    setPainting: (update) => {
      set((state) => {
        const newPainting = {
          ...state.painting,
          ...update,
        };
        return { painting: newPainting };
      });
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
    setTool: (update) => set((state) => ({ 
      tool: {
        ...state.tool,
        ...update
      }
    })),

   // Palette state
    palette: ['🙈', '😭', '😕', '🤠', '😌', '🧞', '😂', '🤬', '😝', '💩', '🤢', '😫'],
    setPalette: (index, paint) => set((state) => {
      const newPalette = [...state.palette];
      newPalette[index] = paint;
      return { palette: newPalette };
    }),

    // Allow shortcuts state
    allowShortcuts: true,
    setAllowShortcuts: (allowShortcuts) => set({ allowShortcuts }),
  })),
);

export default useStore;
