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

    // Stop click events from bubbling past this container to document,
    // where emoji-mart's onClickOutside listener lives. On iOS Safari,
    // shadow DOM event retargeting is unreliable — clicks on search/tabs
    // inside the picker get misidentified as "outside" clicks. This native
    // listener fires before the event reaches document, while emoji-mart's
    // internal handlers (emoji selection, etc.) still work because they're
    // handled within the shadow DOM before the event crosses the boundary.
    const stopPropagation = (e: Event) => e.stopPropagation()
    el.addEventListener('click', stopPropagation)
    return () => el.removeEventListener('click', stopPropagation)
  }, [])

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
        onClickOutside={handleClickOutside}
        emojiButtonColors={['var(--color2)']}
        theme="light"
      />
    </div>
  )
}

export default EmojiPicker
