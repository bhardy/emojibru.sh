import React from 'react'
import copyStringToClipboard from '../utils/copyToClipboard'
import { useGlobalState } from '../store/context'

const Copy = () => {
  const { painting } = useGlobalState()
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