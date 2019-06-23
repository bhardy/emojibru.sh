import React, { useEffect, useReducer } from 'react'

const initialState = {
  painting: {
    grid: [],
    width: 10,
    height: 8,
  },
  tool: {
    type: 'draw',
    paint: '😊',
    alternatePaint: '😎'
  },
  palette: ['⬜','◻️','◽','▫️','⚪','🔲','🔳','⚫','▪️','◾','◼️','⬛']
}

const hydrateFromLocalStorage = (key) => {
  if (localStorage.getItem(key)) {
    return JSON.parse(localStorage.getItem(key))
  } else {
    return initialState[key]
  }
}

const buildInitialState = () => {
  const painting = hydrateFromLocalStorage('painting')
  const tool = hydrateFromLocalStorage('tool')
  const palette = hydrateFromLocalStorage('palette')

  return {
    painting,
    palette,
    tool
  }
}

const StateContext = React.createContext(null)
const DispatchContext = React.createContext(() => 0)

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TOOL':
      return {
        ...state,
        tool: action.payload
      }
    case 'UPDATE_PALETTE':
      return {
        ...state,
        palette: action.payload
      }
    case 'UPDATE_PAINTING':
      return {
        ...state,
        painting: action.payload
      }
    default:
      throw new Error()
  }
}

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, buildInitialState())
  const { painting, palette, tool } = state
  useEffect(() => {
    const saveContextToLocalStorage = () => {
      localStorage.setItem('painting', JSON.stringify(painting))
      localStorage.setItem('palette', JSON.stringify(palette))
      localStorage.setItem('tool', JSON.stringify(tool))
    }
    saveContextToLocalStorage()
  }, [painting, palette, tool])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        { children }
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

const useGlobalState = () => {
  const context = React.useContext(StateContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a CountProvider')
  }
  return context
}

const useGlobalDispatch = () => {
  const context = React.useContext(DispatchContext)
  if (context === undefined) {
    throw new Error('useCountDispatch must be used within a CountProvider')
  }
  return context
}

export {
  Provider,
  useGlobalState,
  useGlobalDispatch
}
