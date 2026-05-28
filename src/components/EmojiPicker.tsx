import React, { useRef, useEffect } from 'react'
import cx from 'classnames'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { Tool } from '@/types'
import css from './EmojiPicker.module.css'

interface EmojiPickerProps {
  handleEmojiSelect: (update: Partial<Tool>) => void
  handleClickOutside: (e: MouseEvent) => void
  edit?: boolean
}

interface EmojiObject {
  native: string
  [key: string]: string
}

const EmojiPicker = ({
  handleEmojiSelect,
  handleClickOutside,
  edit = false,
}: EmojiPickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // On iOS Safari, clicks inside emoji-mart's shadow DOM produce
    // unreliable e.target values at the document level, so contains()
    // checks misfire. Instead, we stop inside clicks from reaching
    // document, then treat any click that does reach document as an
    // outside click — no e.target inspection needed.
    const stopPropagation = (e: Event) => e.stopPropagation()
    el.addEventListener('click', stopPropagation)

    const onDocumentClick = (e: MouseEvent) => handleClickOutside(e)
    document.addEventListener('click', onDocumentClick)

    return () => {
      el.removeEventListener('click', stopPropagation)
      document.removeEventListener('click', onDocumentClick)
    }
  }, [handleClickOutside])

  return (
    <div
      ref={containerRef}
      className={cx(css.container, css.emojiPicker, {
        [css.edit]: edit,
      })}
    >
      <Picker
        data={data}
        set="native"
        title="Pick your paint…"
        previewEmoji="point_up_2"
        onEmojiSelect={(emoji: EmojiObject) =>
          handleEmojiSelect({ paint: emoji.native })
        }
        emojiButtonColors={['var(--color2)']}
        theme="light"
      />
    </div>
  )
}

export default EmojiPicker
