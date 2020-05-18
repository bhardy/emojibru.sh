import React from 'react'
import { RecoilRoot } from 'recoil'
import { initializeState } from '../store/store'
import Header from './Header'
import Artboard from './Artboard'
import Toolbar from './Toolbar'
import Footer from './Footer'
import css from './App.module.css'

const App = () => {
  return (
    <RecoilRoot initializeState={initializeState}>
      <main className={css.app}>
        <Header />
        <Artboard />
        <Toolbar />
        <Footer />
      </main>
    </RecoilRoot>
  )
}

export default App
