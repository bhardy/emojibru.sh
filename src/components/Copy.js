import React from 'react'
import copy from 'copy-to-clipboard'
import { useRecoilValue } from 'recoil'
import { paintingState } from '../store/store'

const Copy = () => {
  const painting = useRecoilValue(paintingState)
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
