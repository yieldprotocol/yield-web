import React from 'react'
import { Link } from 'gatsby'

import Button from './button'

const classMenuButton =
  'inline-block md:hidden bg-transparent border-none relative w-auto text-sm font-medium'
const classLinks =
  'inline-block align-middle w-full md:w-auto py-3 md:py-0 mx-0 md:mx-2 text-center text-xl md:text-base md:text-right font-medium link'

const Header = class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      menuOpen: false,
      isTop: true
    }

    this.isTopChecker = this.isTopChecker.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
  }

  isTopChecker() {
    const isTop = window.scrollY < 50
    if (isTop !== this.state.isTop) {
      this.setState({ isTop })
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.isTopChecker)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.isTopChecker)
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  closeMenu() {
    if (this.state.menuOpen) {
      this.setState({
        menuOpen: false
      })
    }
  }

  render() {
    const { company } = this.props

    const Logo = () => (
      <Link
        className="inline-block text-white font-semibold link font-display"
        title={company}
        to="/"
      >
        <img
          className="inline-block align-middle mr-4 w-6 lg:w-8"
          alt={company}
          src="/logo-white.svg"
        />
        <strong className="hidden md:inline-block align-middle">Yield</strong>
      </Link>
    )

    const RightNav = () => (
      <div className="relative w-auto tl tr-l">
        <a href="https://app.yield.is/" className="underline inherit link" target="_blank">
          Try the app
        </a>
      </div>
    )

    return (
      <nav
        aria-label="main-navigation"
        className={`navbar inline-block fixed w-full left-0 top-0 z-20 border-none text-white font-display ${
          this.state.isTop ? `py-8` : `py-4`
        }`}
        role="navigation"
      >
        <div className={`mx-auto px-5 md:px-12`}>
          <div className="flex w-full justify-between items-center">
            {/* Left */}
            <Logo />
            {/* Right */}
            <div className="hidden md:inline-block relative tr">
              <RightNav />
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Header
