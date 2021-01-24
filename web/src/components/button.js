import React from 'react'
import { Link } from 'gatsby'

const ButtonClass = 'inline-block relative text-center rounded-lg'

class Button extends React.Component {
  render() {
    const {
      outlined,
      gradient,
      external,
      primary,
      margin,
      large,
      small,
      full,
      type,
      text,
      to
    } = this.props

    const RenderClass = `${ButtonClass} ${
      small ? 'text-sm' : large ? 'text-xl' : 'font-bold text-base'
    } ${gradient ? 'gradient-button font-bold' : ''} ${
      outlined
        ? 'border-2 border-solid border-indigo-700 bg-transparent text-indigo-700 px-4 py-3'
        : 'link bg-transparent'
    } ${
      primary
        ? 'border-2 border-solid border-indigo-700 bg-indigo-700 text-white font-bold px-4 py-2'
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
