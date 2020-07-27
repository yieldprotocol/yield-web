import React from 'react'
import { Link } from 'gatsby'

import Container from './container'

import { logEvent } from '../utils/analytics'

const classColumns = 'w-full md:w-4/12 mb-6'
const classStrong = 'inline-block w-full font-bold text-md mb-4'
const classLinks =
  'inline-block w-full md:w-auto font-normal text-gray-300 text-sm mb-2 md:mb-0 mr-0 md:mr-8 link py-1'
const year = new Date().getFullYear()

const Footer = class extends React.Component {
  constructor(props) {
    super(props)

    this.logClick = this.logClick.bind(this)
    this.getTime = this.getTime.bind(this)
  }

  logClick(name) {
    const event = {
      category: 'Social',
      action: `Clicked ${name}`,
    }
    logEvent(event)
  }

  getTime(currentTime = new Date()) {
    const currentHour = currentTime.getHours()
    const splitAfternoon = 12 // 24hr time to split the afternoon
    const splitEvening = 17 // 24hr time to split the evening

    if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
      // Between 12 PM and 5PM
      return 'Good afternoon from'
    } else if (currentHour >= splitEvening) {
      // Between 5PM and Midnight
      return 'Good evening from'
    }
    // Between dawn and noon
    return 'Good morning from'
  }

  render() {
    const { country, company, email, city } = this.props

    const footerLinks = [
      {
        title: 'Yield',
        list: [
          {
            title: 'About us',
            link: '/about',
          },
          {
            title: 'Mission',
            link: '/mission',
          },
          {
            title: 'Careers',
            link: '/careers',
          },
        ],
      },
      {
        title: 'Resources',
        list: [
          {
            title: 'Insights',
            link: '/insights',
          },
          {
            title: 'White papers',
            link: '/white-papers',
          },
        ],
      },
      {
        title: 'Services',
        list: [
          {
            title: 'View all our services',
            link: '/services',
          },
          {
            title: 'Get in touch',
            link: '/contact',
          },
        ],
      },
    ]

    const LinkComponent = ({ title, list }) => (
      <div className={classColumns} key={`${title}-${Math.random()}`}>
        <strong className={classStrong}>{title}</strong>
        <ul className="inline-block w-full">
          {list.map((item, index) => (
            <li key={`list-${index}`}>
              {item.external ? (
                <a className={classLinks} target="_blank" href={item.link}>
                  {item.title} {item.cta}
                </a>
              ) : (
                <Link className={classLinks} to={item.link}>
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    )

    return (
      <footer className="inline-block w-full py-6">
        <Container>
          {/* Top line */}
          <div className="inline-block md:flex items-start justify-between w-full">
            {/* Logo */}
            <div className={classColumns}>
              <img
                className="inline-block align-middle mr-2 w-12 md:w-14"
                src="/logo-white.svg"
                alt={company}
              />
            </div>
            {/* Links */}
            {footerLinks.map((object, index) => (
              <LinkComponent title={object.title} list={object.list} key={index} />
            ))}
          </div>
          {/* Bottom line */}
          <div className="inline-block w-full my-8">
            <div className="inline-block relative w-full">
              <p className="w-full text-left text-sm text-gray-500">
                &copy; {year} {company}
              </p>
            </div>
            <div className="inline-block w-full md:3/12">
              <a
                className="text-xs text-gray-500 underline link"
                target="_blank"
                href={`https://www.google.ca/maps?q=${city}, ${country || `USA`}`}
                rel="noopener noreferrer"
              >
                {this.getTime()} {city}
              </a>
            </div>
          </div>
        </Container>
      </footer>
    )
  }
}

export default Footer
