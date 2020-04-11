import React from 'react'
import copy from 'copy-to-clipboard'
import { useGlobalState } from '../store/context'

const Copy = () => {
  const { painting } = useGlobalState()
  const copyText = () => {
    const { grid } = painting
    let output = ''
    output = grid.map(function (row) {
      return row.join('') + '\n'
    }).join('')
    copy(output)
  }
  return (
    <button className="button" onClick={copyText}>Copy to clipboard</button>
  )
}

export default Copy
