import React from 'react'
import css from './Footer.module.css'

const Footer = () => (
  <footer className={css.footer}>
    <p>Made with <span role="img" aria-label="Love">😍</span> by <a href="https://branthardy.com/" target="_blank" rel="noopener noreferrer">Brant Hardy</a>. Copyright &copy;&nbsp;{new Date().getFullYear()}</p>
    <p>Thank you to <a href="https://missiveapp.com/">Missive</a> for developing <a href="https://www.npmjs.com/package/emoji-mart" target="_blank" rel="noopener noreferrer">Emoji Mart</a> which EmojiBrush uses for the&nbsp;EmojiPicker</p>
    <p>This is very beta! File <span role="img" aria-label="Bugs">🐛🐞</span> or contribute on <a href="https://github.com/bhardy/emojibru.sh" target="_blank" rel="noopener noreferrer">Github</a>&nbsp;<span role="img" aria-label="Github">🐙😻</span></p>
  </footer>
)

export default Footer
