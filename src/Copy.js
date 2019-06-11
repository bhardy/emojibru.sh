import React from 'react'
import copyStringToClipboard from './utils/copyToClipboard'

const Copy = ({ painting }) => {
  const copyText = () => {
    const { grid } = painting
    let output = ''
    output = grid.map(function (row) {
      return row.join('') + '\n'
    }).join('')
    copyStringToClipboard(output)
  }
  return (
    <button className="button" onClick={copyText}>Copy to clipboard</button>
  )
}

export default Copy
