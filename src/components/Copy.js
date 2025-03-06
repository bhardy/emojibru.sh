import React from 'react'
import copy from 'copy-to-clipboard'
import useStore from "../store/store";

const Copy = () => {
  const painting = useStore((state) => state.painting);
  const copyText = () => {
    const { grid } = painting
    let output = ''
    output = grid.map(function (row) {
      return row.join('') + '\n'
    }).join('')
    copy(output)
  }
  return (
    <button type="button" className="button" onClick={copyText}>Copy to clipboard</button>
  )
}

export default Copy
