import React from 'react'
import { useRecoilValue } from 'recoil'
import { paintingState } from '../store/store'

const Tweet = () => {
  const painting = useRecoilValue(paintingState)
  const { grid } = painting
  const output = grid.map(function (row) {
    return row.join('') + '\n'
  }).join('')
  const base = `https://twitter.com/intent/tweet`
  const url = `url=https://emojibru.sh`
  const hashtags = `hashtags=emojibrush`
  const text = `text=${encodeURI(output)}`
  const via = `via=emojibrush1`

  return (
    <a 
      href={`${base}?${url}&${hashtags}&${text}&${via}`}
      className="button"
      target="_blank"
      rel="noopener noreferrer"
    >
      Tweet it
    </a>
  )
}

export default Tweet
