import React from 'react'
import { RecoilRoot } from 'recoil'
import ReactGA from 'react-ga';
import { initializeState } from '../store/store'
import Header from './Header'
import Artboard from './Artboard'
import Toolbar from './Toolbar'
import Footer from './Footer'
import css from './App.module.css'

ReactGA.initialize('UA-174636871-1');
ReactGA.pageview(window.location.pathname + window.location.search);

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
