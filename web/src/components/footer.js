import React from 'react'
import { Link } from 'gatsby'

import Logotype from './logotype'

import { logEvent } from '../utils/analytics'
import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

const classLinks =
  'inline-block align-middle w-full md:w-auto font-normal text-gray-600 text-sm mb-2 md:mb-0 mr-0 md:mr-8 link py-1'
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
      action: `Clicked ${name}`
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
    const { country, socials, company, email, city } = this.props

    const footerLinks = [
      {
        title: 'Resources',
        list: [
          {
            title: 'Insights',
            link: '/insights'
          },
          {
            title: 'White papers',
            link: '/white-papers'
          }
        ]
      },
      {
        title: 'Follow us',
        list: socials.map(social => {
          return {
            external: true,
            title: social.title,
            image: social.image,
            link: social.url
          }
        })
      }
    ]

    const LinkComponent = ({ title, list }) =>
      list.map((item, index) =>
        item.external ? (
          <a className={classLinks} target="_blank" href={item.link}>
            {item.image ? (
              <img
                className="inline-block align-middle mr-2 h-4 w-4 contain"
                src={imageUrlFor(buildImageObj(item.image))}
              />
            ) : null}{' '}
            {item.title} {item.cta}
          </a>
        ) : (
          <Link className={classLinks} to={item.link}>
            {item.title}
          </Link>
        )
      )

    return (
      <footer className="inline-block w-full py-6 px-5 md:px-12 realtive md:fixed bottom-0 right-0 left-0 text-gray-500 text-sm">
        <div className="inline-block relative w-full md:flex align-middle items-center">
          <div className="inline-block relative w-full md:w-1/4 mb-8 md:mb-0">
            <Logotype company={company} />
          </div>
          <div className="inline-block relative w-full md:w-2/4">
            {footerLinks.map((object, index) => (
              <LinkComponent title={object.title} list={object.list} key={index} />
            ))}
          </div>
          <div className="inline-block relative w-full md:1/4"></div>
        </div>
      </footer>
    )
  }
}

export default Footer
