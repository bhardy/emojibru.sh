import React from 'react'
import { Provider } from './store/context'
import Artboard from './Artboard'
import Toolbar from './Toolbar'
import css from './styles/App.module.css'

const App = () => {
  return (
    <Provider>
      <div className={css.app}>
        <h1 className={css.header}>EmojiBrush</h1>
        <Artboard />
        <Toolbar />
        <div className={css.footer}>
          <p>Made with <span role="img" aria-label="Love">😍</span> by <a href="https://branthardy.com/" target="_blank" rel="noopener noreferrer">Brant Hardy</a>. Copyright &copy; {new Date().getFullYear()}</p>
          <p>Thank you to <a href="https://missiveapp.com/">Missive</a> for developing <a href="https://www.npmjs.com/package/emoji-mart" target="_blank" rel="noopener noreferrer">Emoji Mart</a> which EmojiBrush uses for the EmojiPicker</p>
        </div>
      </div>
    </Provider>
  )
}

export default App
