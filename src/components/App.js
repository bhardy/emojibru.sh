import React from 'react'
import { Provider } from '../store/context'
import Header from './Header'
import Artboard from './Artboard'
import Toolbar from './Toolbar'
import Footer from './Footer'
import css from './App.module.css'

const App = () => {
  return (
    <Provider>
      <main className={css.app}>
        <Header />
        <Artboard />
        <Toolbar />
        <Footer />
      </main>
    </Provider>
  )
}

export default App
