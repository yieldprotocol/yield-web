import React from 'react'
import { Link } from 'gatsby'

const ButtonClass = 'inline-block relative text-center'

class Button extends React.Component {
  render() {
    const {
      outlined,
      gradient,
      external,
      primary,
      margin,
      small,
      full,
      type,
      text,
      to
    } = this.props

    const RenderClass = `${ButtonClass} ${small ? 'text-sm' : 'font-bold text-base'} ${
      gradient ? 'gradient-button' : ''
    } ${
      outlined
        ? 'border-2 border-solid border-primary bg-transparent text-primary px-4 py-3'
        : 'underline link bg-transparent'
    } ${
      primary
        ? 'border-2 border-solid border-primary bg-primary text-white px-4 py-2'
        : 'bg-transparent'
    } ${margin ? margin : ''} ${full ? 'md:w-full' : 'md:w-auto'}`

    return (
      <>
        {external ? (
          <a className={RenderClass} target="_blank" href={to} rel="noopener noreferrer">
            {text || `Learn more`}
          </a>
        ) : type ? (
          <button className={RenderClass} type={type}>
            {text || `Learn more`}
          </button>
        ) : (
          <Link className={RenderClass} to={to}>
            {text || `Learn more`}
          </Link>
        )}
      </>
    )
  }
}

export default Button
