import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

const detailsQuery = graphql`
  query SEOQuery {
    site: sanitySiteSettings(_id: { regex: "/(drafts.|)siteSettings/" }) {
      title
      description
      keywords
      author
      image {
        asset {
          _id
        }
      }
    }
  }
`

function SEO({ description, image, lang, meta, keywords = [], title, url }) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={data => {
        if (!data.site) {
          return
        }
        const metaDescription = description || data.site.description
        const socialImage = image || 'https://{tbd}.netlify.app/img/social.png'
        const siteUrl = url || 'https://{tbd}.netlify.app/'
        return (
          <Helmet
            htmlAttributes={{
              lang
            }}
            title={title}
            titleTemplate={title === data.site.title ? '%s' : `%s | ${data.site.title}`}
            link={[
              {
                href: 'https://{tbd}.netlify.app/favicons/apple-touch-icon.png',
                sizes: '180x180',
                rel: 'apple-touch-icon'
              },
              {
                href: 'https://{tbd}.netlify.app/favicons/favicon-32x32.png',
                sizes: '32x32',
                type: 'image/png',
                rel: 'icon'
              },
              {
                href: 'https://{tbd}.netlify.app/favicons/favicon-16x16.png',
                sizes: '16x16',
                type: 'image/png',
                rel: 'icon'
              },
              {
                href: 'https://{tbd}.netlify.app/favicons/site.webmanifest',
                rel: 'manifest'
              },
              {
                href: 'https://{tbd}.netlify.app/favicons/safari-pinned-tab.svg',
                color: '#5641ff',
                rel: 'mask-icon'
              },
              {
                href: 'https://{tbd}.netlify.app/favicons/favicon.ico',
                rel: 'shortcut icon'
              },
              {
                href:
                  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
                rel: 'stylesheet'
              }
            ]}
            meta={[
              {
                name: 'description',
                content: metaDescription
              },
              {
                property: 'fb:app_id',
                content: '608466123308002'
              },
              {
                property: 'og:image:width',
                content: '1920'
              },
              {
                property: 'og:image:height',
                content: '1080'
              },
              {
                property: 'og:title',
                content: title
              },
              {
                property: 'og:description',
                content: metaDescription
              },
              {
                property: 'og:type',
                content: 'website'
              },
              {
                name: 'twitter:card',
                content: 'summary'
              },
              {
                name: 'twitter:creator',
                content: data.site.author
              },
              {
                name: 'twitter:title',
                content: title
              },
              {
                name: 'twitter:description',
                content: metaDescription
              },
              {
                content: '#603cba',
                name: 'msapplication-TileColor'
              },
              {
                content: 'https://{tbd}.netlify.app/favicons/browserconfig.xml',
                name: 'msapplication-config'
              },
              {
                content: '#241e53',
                name: 'theme-color'
              }
            ]
              .concat(
                keywords && keywords.length > 0
                  ? {
                      name: 'keywords',
                      content: keywords.join(', ')
                    }
                  : []
              )
              .concat(meta)}
          />
        )
      }}
    />
  )
}

SEO.defaultProps = {
  lang: 'en',
  meta: [],
  keywords: []
}

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired
}

export default SEO
