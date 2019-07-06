import React from 'react'
import css from './styles/Help.module.css'

const Help = ({forwardedRef}) => (
  <div ref={forwardedRef} className={css.container}>
    <article className={css.help}>
      <h2 className={css.heading}>Shortcuts</h2>
      <dl className={css.shortcuts}>
        <dt>Show Help</dt>
        <dd>h</dd>
        <dt>Swap Paint</dt>
        <dd>x</dd>
        <dt>Edit Palette</dt>
        <dd>p</dd>
        <dt>Show EmojiPicker</dt>
        <dd>s</dd>
        <dt>Hide EmojiPicker</dt>
        <dd>esc</dd>
        <dt>Draw</dt>
        <dd>d</dd>
        <dt>Fill</dt>
        <dd>f</dd>
        <dt>Erase</dt>
        <dd>e</dd>
      </dl>
    </article>
  </div>
)

export default Help
