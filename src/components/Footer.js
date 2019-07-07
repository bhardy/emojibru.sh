import React from 'react'
import css from './Footer.module.css'

const Footer = () => (
  <footer className={css.footer}>
    <p>Made with <span role="img" aria-label="Love">😍</span> by <a href="https://branthardy.com/" target="_blank" rel="noopener noreferrer">Brant Hardy</a>. Copyright &copy; {new Date().getFullYear()}</p>
    <p>Thank you to <a href="https://missiveapp.com/">Missive</a> for developing <a href="https://www.npmjs.com/package/emoji-mart" target="_blank" rel="noopener noreferrer">Emoji Mart</a> which EmojiBrush uses for the EmojiPicker</p>
  </footer>
)

export default Footer
