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

    // Handle click-outside detection ourselves instead of relying on
    // emoji-mart's onClickOutside, which breaks on iOS Safari due to
    // unreliable shadow DOM event retargeting. Using contains() to check
    // if the click target is inside our container works reliably across
    // all browsers regardless of shadow DOM boundaries.
    const onDocumentClick = (e: MouseEvent) => {
      if (!el.contains(e.target as Node)) {
        handleClickOutside(e)
      }
    }

    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
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
