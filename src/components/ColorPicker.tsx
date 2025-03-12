import React, { forwardRef } from "react"
import cx from "classnames"
import useKey from "react-use/lib/useKey"
import { Tool } from "@/types"
import css from "./ColorPicker.module.css"

interface ColorPickerProps {
  tool: Tool
  updateTool: (update: Partial<Tool>) => void
  mini?: boolean
}

const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(
  ({ tool, updateTool, mini }, ref) => {
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
  }
)

ColorPicker.displayName = "ColorPicker"

export default ColorPicker
