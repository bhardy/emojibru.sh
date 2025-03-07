import React, { forwardRef } from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import useKey from "react-use/lib/useKey"
import css from "./ColorPicker.module.css"

const ColorPicker = forwardRef(({ tool, updateTool, mini }, ref) => {
  const handleSwap = () => {
    updateTool({
      paint: tool.alternatePaint,
      alternatePaint: tool.paint,
    })
  }

  useKey("x", handleSwap, {}, [tool])

  return (
    <div className={cx(css.colorPicker, { [css.mini]: mini })} ref={ref}>
      <div className={cx(css.swatch, css.active)}>{tool.paint}</div>
      <div
        className={cx(css.swatch, css.alternate)}
        onClick={() => handleSwap()}
        role="button"
      >
        {tool.alternatePaint}
      </div>
    </div>
  )
})

ColorPicker.propTypes = {
  tool: PropTypes.object.isRequired,
  updateTool: PropTypes.func.isRequired,
}

ColorPicker.displayName = "ColorPicker"

export default ColorPicker
