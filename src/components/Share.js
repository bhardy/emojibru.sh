import React from 'react'
import Copy from './Copy'
import Download from './Download'
import Tweet from './Tweet'
import css from './Share.module.css'

const Share = () => {
  return (
    <div className={css.share}>
      <Copy />
      <Download />
      <Tweet />
    </div>
  )
}

export default Share
