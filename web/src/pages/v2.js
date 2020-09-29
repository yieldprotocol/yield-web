import React from 'react'
import { graphql, Link } from 'gatsby'
import { ArrowUpRight } from 'react-feather'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

import GraphQLErrorList from '../components/graphql-error-list'
import BlockContent from '../components/block-content'
import ContainerFull from '../components/container-full'
import Button from '../components/button'
import SEO from '../components/seo'

import Layout from '../containers/layout'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base my-8 text-gray-100'
const ClassLinks =
  'flex justify-start items-center relative w-full text-xs md:text-sm underline link py-1 font-light'

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
      mainImage {
        asset {
          _id
        }
      }
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

  const NavLinks = [
    {
      title: 'About us',
      to: '/about'
    },
    {
      title: 'White papers',
      to: '/white-papers'
    },
    {
      title: 'Careers',
      to: '/careers'
    },
    {
      external: true,
      title: 'Blog',
      to: 'https://medium.com/yield-protocol'
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
      <ContainerFull
        style={{
          background: `url(${imageUrlFor(buildImageObj(page.mainImage)).url()})`,
          backgroundPosition: 'center 25%',
          backgroundSize: 'cover'
        }}
      >
        <div className="inline-block md:flex h-full">
          {/* Left */}
          <div className="inline-block relative nav w-full md:w-1/4 mb-8 md:mb-0">
            {NavLinks.map((item, index) =>
              item.external ? (
                <a
                  className={`${ClassLinks} ${
                    NavLinks.length !== index + 1 ? 'mr-0 md:mr-4' : 'mr-0 md:mr-0'
                  }`}
                  target="_blank"
                  href={item.to}
                  key={Math.random()}
                  rel="noopener noreferre"
                >
                  {item.title}
                  <div className="ml-1">
                    <ArrowUpRight size={18} />
                  </div>
                </a>
              ) : (
                <Link
                  className={`${ClassLinks} ${
                    NavLinks.length !== index + 1 ? 'mr-0 md:mr-4' : 'mr-0 md:mr-0'
                  }`}
                  key={Math.random()}
                  to={item.to}
                >
                  {item.title}
                </Link>
              )
            )}
          </div>
          {/* Middle */}
          <div className="inline-block relative w-full md:w-2/4 mb-8 md:mb-0 pr-0 md:pr-16">
            <h1 className="text-4xl md:text-6xl font-display">
              {page.heading || `Borrow at fixed rates. Earn predictable interest.`}
            </h1>
            <div className={`${ParagraphClass}`}>
              <BlockContent blocks={page._rawBody || []} />
            </div>
            {page.ctaPrimary || page.ctaSecondary ? (
              <div className="inline-block relative w-full">
                <div className="inline-block md:flex justify-start items-center relative w-full md:w-auto m-auto">
                  <Button
                    external
                    margin="mr-4 mb-4 md:mb-0"
                    text={page.ctaPrimary}
                    to={page.ctaPrimaryURL}
                  />
                  <Button
                    external
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
      {/* {page.mainImage ? (
        <img
          className="hidden md:block absolute bottom-0 right-0 top-0 w-screen h-screen fit z-0"
          src={imageUrlFor(buildImageObj(page.mainImage)).url()}
        />
      ) : (
        <img
          className="hidden md:block absolute bottom-0 right-0 top-0 min-h-display h-screen fit z-0"
          src="/img/moon/spaceman.png"
        />
      )} */}
    </Layout>
  )
}

export default IndexPage
