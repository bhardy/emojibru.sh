import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import useKey from 'react-use/lib/useKey'
import Help from './Help'
import css from './styles/Header.module.css'

const Header = () => {
  const [isHelping, setHelping] = useState(false)
  useKey('Escape', () => setHelping(false))
  useKey('h', () => setHelping(true))

  const helpNode = useRef();
  const helpButton = useRef();

  const handleClickOutside = e => {
    if (helpNode.current.contains(e.target)) return
    if (helpButton.current.contains(e.target)) return
    setHelping(false)
  };

  useEffect(() => {
    if (isHelping) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isHelping]);

  return (
    <header className={css.header}>
      <h1 className={css.heading}>EmojiBrush</h1>
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
