import React, { useState } from 'react'
import { graphql, Link } from 'gatsby'

import { mapEdgesToNodes, filterOutDocsWithoutSlugs, buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

import GraphQLErrorList from '../components/graphql-error-list'
import BlockContent from '../components/block-content'
import ContainerFull from '../components/container-full'
import Button from '../components/button'
import SEO from '../components/seo'

import Layout from '../containers/layout'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base my-8 text-gray-600'
const ClassLinks = 'inline-block relative w-full text-xs md:text-sm underline link py-1 font-light'

export const query = graphql`
  query IndexPageQuery {
    site: sanitySiteSettings(_id: { regex: "/(drafts.|)siteSettings/" }) {
      title
      description
      image {
        asset {
          _id
        }
      }
      keywords
    }

    page: sanityHome(_id: { regex: "/(drafts.|)home/" }) {
      id
      title
      heading
      _rawBody
      ctaPrimary
      ctaPrimaryURL
      ctaSecondary
      ctaSecondaryURL
      stats {
        stat
        title
        description
        url
        image {
          asset {
            _id
          }
        }
      }
      slide2LeftTitle
      slide2LeftDescription
      slide2LeftImage {
        asset {
          _id
        }
      }
      slide2RightTitle
      slide2RightDescription
      slide2RightImage {
        asset {
          _id
        }
      }
      showBlog
      mainCTA
      mainCTAURL
    }
  }
`

const IndexPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const site = (data || {}).site
  const page = (data || {}).page
  const postNodes = (data || {}).posts
    ? mapEdgesToNodes(data.posts).filter(filterOutDocsWithoutSlugs)
    : []

  if (!site) {
    throw new Error(
      'Missing "Site settings". Open the studio at http://localhost:3333 and add some content to "Site settings" and restart the development server.'
    )
  }

  if (!page) {
    throw new Error(
      'Missing "Pages > Home". Open the studio at http://localhost:3333 and add some content to "Pages > Home" and restart the development server.'
    )
  }

  const Stat = ({ stat }) => (
    <div className="inline-block text-white border-b-4 border-solid border-gray-800 py-4">
      <strong className="inline-block relative w-full text-2xl font-bold mb-4">{stat.stat}</strong>
      {stat.image ? (
        <img
          className="inline-block w-full h-48 fit rounded-sm mb-4"
          src={imageUrlFor(buildImageObj(stat.image))}
        />
      ) : null}
      {stat.title ? (
        <p className="inline-block relative w-full text-base text-gray-400 font-semibold mb-4">
          {stat.title}
        </p>
      ) : null}

      {stat.description ? (
        <p className="inline-block relative w-full text-sm text-gray-500">{stat.description}</p>
      ) : null}
      {stat.url ? (
        <a
          className="inline-block relative w-full text-sm text-gray-500 link underline"
          href={stat.url}
        >
          View link
        </a>
      ) : null}
    </div>
  )

  const NavLinks = [
    {
      title: 'About us',
      to: '/about'
    },
    {
      title: 'Mission',
      to: '/mission'
    },
    {
      title: 'Careers',
      to: '/careers'
    },
    {
      title: 'Blog',
      to: '/blog'
    }
  ]

  return (
    <Layout>
      <SEO
        title={page.title}
        description={site.description}
        keywords={site.keywords}
        image={
          site.image && site.image.asset && site.image.asset._id
            ? imageUrlFor(buildImageObj(site.image))
            : false
        }
      />
      <ContainerFull>
        <div className="inline-block md:flex h-full">
          {/* Left */}
          <div className="inline-block relative nav w-full md:w-1/4 mb-8 md:mb-0">
            {NavLinks.map((item, index) => (
              <Link
                className={`${ClassLinks} ${
                  NavLinks.length !== index + 1 ? 'mr-0 md:mr-4' : 'mr-0 md:mr-0'
                }`}
                key={Math.random()}
                to={item.to}
              >
                {item.title}
              </Link>
            ))}
          </div>
          {/* Middle */}
          <div className="inline-block relative w-full md:w-2/4 mb-8 md:mb-0 pr-0 md:pr-16">
            <h1 className="text-4xl md:text-6xl font-display">
              {page.heading || `Borrow at fixed rates. Earn predictable interest.`}
            </h1>
            <div className={`${ParagraphClass}`}>
              <BlockContent blocks={page._rawBody || []} />
            </div>
            {/* <Button text="Try the app" to="https://app.yield.is/" external link /> */}
            {page.ctaPrimary || page.ctaSecondary ? (
              <div className="inline-block relative w-full">
                <div className="inline-block md:flex justify-start items-center relative w-full md:w-auto m-auto">
                  <Button
                    margin="mr-4 mb-4 md:mb-0"
                    text={page.ctaPrimary}
                    to={page.ctaPrimaryURL}
                  />
                  <Button
                    margin="mb-8 md:mb-0"
                    text={page.ctaSecondary}
                    to={page.ctaSecondaryURL}
                  ></Button>
                </div>
              </div>
            ) : null}
          </div>
          {/* Right */}
          <div className="inline-block relative w-full md:w-1/4 text-left md:text-right">
            <div className="relative md:absolute bottom-0 right-0 text-xs text-white opacity-75 w-full md:w-48">
              <p>
                Yield has been audited by ASDF on September 1, 2020 to learn more{' '}
                <a href="https://#/" target="_blank" className="underline link">
                  read the report here
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </ContainerFull>
      {/* Image */}
      <img
        className="hidden md:block absolute bottom-0 right-0 top-0 min-h-display h-screen fit z-0"
        src="/img/moon/spaceman.png"
      />
    </Layout>
  )
}

export default IndexPage
