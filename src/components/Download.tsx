import React from 'react'

const handleDownload = () => {
  const canvas = document.getElementById(
    'emojibrush-canvas',
  ) as HTMLCanvasElement | null
  if (!canvas) return
  const dataURL = canvas.toDataURL()
  const element = document.createElement('a')

  element.setAttribute('href', dataURL)
  element.setAttribute('download', 'emojibrush.png')
  element.style.display = 'none'
  document.body.appendChild(element)
  element.click()
  document.body.removeChild(element)
}

const Download = () => {
  return (
    <button type="button" className="button" onClick={handleDownload}>
      Download PNG
    </button>
  )
}

export default Download
