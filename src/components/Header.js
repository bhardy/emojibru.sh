import React, { useEffect, useRef, useState } from 'react'
import useStore from "../store/store";
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import Help from './Help'
import logo from '../images/logo.svg'
import css from './Header.module.css'

const Header = () => {
  const shortcutsEnabled = useStore((state) => state.allowShortcuts)
  const [isHelping, setHelping] = useState(false)
  useKey('Escape', () => setHelping(false))
  useKey('h', () => shortcutsEnabled && setHelping(true), {}, [shortcutsEnabled])

  const helpNode = useRef()
  const helpButton = useRef()

  const handleClickOutside = e => {
    if (helpNode.current.contains(e.target)) return
    if (helpButton.current.contains(e.target)) return
    setHelping(false)
  }

  useEffect(() => {
    if (isHelping) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [isHelping])

  return (
    <header className={css.header}>
      <h1 className={css.heading}>
        <img className={css.logo} src={logo} alt="EmojiBrush Logo" />
        EmojiBrush
      </h1>
      <button
        ref={helpButton}
        className={cx(css.help, {
          [css.helping]: isHelping,
          'topLayer': isHelping,
        })}
        onClick={() => setHelping(!isHelping)}
      >
        { isHelping ? `I'm okay` : `Help` }
      </button>
      {isHelping && <Help forwardedRef={helpNode} />}
    </header>
  )
}

export default Header
