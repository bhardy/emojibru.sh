import React from 'react'
import Header from './Header'
import Artboard from './Artboard'
import Toolbar from './Toolbar'
import Footer from './Footer'
import css from './App.module.css'

const App = () => {
  return (
    <main className={css.app}>
      <Header />
      <Artboard />
      <Toolbar />
      <Footer />
    </main>
  )
}

export default App
