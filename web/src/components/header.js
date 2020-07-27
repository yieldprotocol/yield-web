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

    const MiddleNavLinks = [
      {
        title: 'About us',
        to: '/about'
      },
      {
        title: 'Services',
        to: '/services'
      },
      {
        title: 'Mission',
        to: '/mission'
      },
      {
        title: 'Contact us',
        to: '/contact'
      },
      {
        title: 'Careers',
        to: '/careers'
      },
      {
        title: 'Insights',
        to: '/insights'
      }
    ]

    const Logo = () => (
      <Link className="inline-block text-white font-semibold link" title={company} to="/">
        <img
          className="inline-block align-middle mr-4 w-6 lg:w-8"
          alt={company}
          src="/logo-white.svg"
        />
        <strong className="hidden md:inline-block align-middle">Yield</strong>
      </Link>
    )

    const MiddleNav = () => (
      <div className="inline-block w-full text-center py-8 md:py-0">
        {MiddleNavLinks.map((item, index) => (
          <Link
            className={`${classLinks} ${
              MiddleNavLinks.length !== index + 1 ? 'mr-0 md:mr-4' : 'mr-0 md:mr-0'
            }`}
            key={Math.random()}
            to={item.to}
          >
            {item.title}
          </Link>
        ))}
      </div>
    )

    const RightNav = () => (
      <div className="relative w-auto tl tr-l">
        <Button text="Talk to us" to="/contact" outlined />
      </div>
    )

    const CloseButton = () => (
      <button className={classMenuButton} onClick={this.closeMenu}>
        Close
      </button>
    )

    const MenuButton = () => (
      <button className={classMenuButton} onClick={this.toggleMenu}>
        Menu
      </button>
    )

    return (
      <nav
        aria-label="main-navigation"
        className={`navbar inline-block fixed w-full left-0 top-0 z-20 border-none ${
          this.state.isTop ? `py-8` : `py-4`
        }`}
        role="navigation"
      >
        {/* Mobile nav */}
        <div
          className={`mobile inline-block fixed overflow-y-auto overflow-x-hidden bg-black text-center left-0 top-0 w-full h-screen px-5 z-30
          ${this.state.menuOpen ? `open` : ''} ${this.state.isTop ? `py-8` : `py-4`}`}
        >
          <div className="flex w-100 justify-between items-center">
            <Logo />
            <div className="inline-block md:hidden relative tr">
              <CloseButton />
            </div>
          </div>
          <div className="inline-block relative w-full mb-4">
            <MiddleNav />
            <RightNav />
          </div>
        </div>
        {/* Non-Mobile nav */}
        <div className={`container mx-auto px-5`}>
          <div className="flex w-full justify-between items-center">
            {/* Left */}
            <Logo />
            {/* Middle */}
            <div className="hidden md:inline-block w-7/12 relative tc">
              <MiddleNav />
            </div>
            {/* Right */}
            <div className="hidden md:inline-block relative tr">
              <RightNav />
            </div>
            {/* Menu */}
            <div className="inline-block md:hidden relative tr">
              <MenuButton />
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Header
