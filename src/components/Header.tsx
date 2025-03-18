import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import Help from './Help'
import Image from 'next/image'
import css from './Header.module.css'

const Header = () => {
  const [isHelping, setHelping] = useState(false)
  useKey('Escape', () => setHelping(false))
  useKey('h', () => setHelping(true), {}, [])

  const helpNode = useRef<HTMLDivElement>(null)
  const helpButton = useRef<HTMLButtonElement>(null)

  const handleClickOutside = (e: MouseEvent | TouchEvent) => {
    if (!helpNode.current || !helpButton.current) return
    if (helpNode.current.contains(e.target as Node)) return
    if (helpButton.current.contains(e.target as Node)) return
    setHelping(false)
  }

  useEffect(() => {
    if (isHelping) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isHelping])

  return (
    <header className={css.header}>
      <h1 className={css.heading}>
        <Image
          className={css.logo}
          src="./logo.svg"
          width={32}
          height={38}
          alt="EmojiBrush Logo"
        />
        EmojiBrush
      </h1>
      <button
        type="button"
        ref={helpButton}
        className={cx(css.help, 'button', {
          [css.helping]: isHelping,
          topLayer: isHelping,
        })}
        onClick={() => setHelping(!isHelping)}
      >
        {isHelping ? `I'm okay` : `Help`}
      </button>
      {isHelping && <Help forwardedRef={helpNode} />}
    </header>
  )
}

export default Header
