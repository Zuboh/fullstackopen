import { useState } from 'react'

const Togglable = ({ buttonLabel, children, visible, setVisible }) => {
  const [internalVisible, setInternalVisible] = useState(false)
  const isControlled = typeof visible === 'boolean' && typeof setVisible === 'function'
  const shown = isControlled ? visible : internalVisible

  const hideWhenVisible = { display: shown ? 'none' : '' }
  const showWhenVisible = { display: shown ? '' : 'none' }

  const toggleVisibility = () => {
    if (isControlled) {
      setVisible(!shown)
      return
    }

    setInternalVisible(!shown)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={toggleVisibility}>
          {buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button type="button" onClick={toggleVisibility}>
          cancel
        </button>
      </div>
    </div>
  )
}

export default Togglable
