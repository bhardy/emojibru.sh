import React from 'react'
import PropTypes from 'prop-types'

const Tool = ({ tool, updateTool }) => {
  return (
    <div className="tool">
      <p>Current Tool: {tool.type}</p>
      <label>
        <input
          type="radio"
          name="fill"
          value="fill"
          checked={tool.type === 'fill'}
          onChange={() => updateTool({ type: 'fill' })}
        />
        Fill
      </label>
      <label>
        <input
          type="radio"
          name="draw"
          value="draw"
          checked={tool.type   === 'draw'}
          onChange={() => updateTool({ type: 'draw' })}
        />
        Draw
      </label>
      <p>Current Paint: {tool.paint}</p>
    </div>
  )
}

Tool.propTypes = {
  tool: PropTypes.object.isRequired
}

export default Tool
