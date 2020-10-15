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
      _rawAudit
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
    <Layout dark>
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
      <ContainerFull className="astronaut overlay">
        <div className="flex align-middle items-center mx-auto max-w-2xl h-full text-left md:text-center relative">
          <div className="inline-block relative w-full mb-8 md:mb-0 z-10 content">
            <h1 className="text-4xl md:text-5xl font-display">
              {page.heading || `Borrow at fixed rates. Earn predictable interest.`}
            </h1>
            <div className={`${ParagraphClass}`}>
              <BlockContent blocks={page._rawBody || []} />
            </div>
            {page.ctaPrimary || page.ctaSecondary ? (
              <div className="inline-block relative w-full mb-12">
                <div className="inline-block md:flex justify-center items-center relative w-full">
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
            {page._rawAudit ? (
              <div className="inline-block relative w-full">
                <div className="relative text-xs text-white opacity-75 w-full md:w-48 mx-auto">
                  <BlockContent blocks={page._rawAudit || []} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {/* Sticky fruits */}
        <div className="absolute bottom-0 right-0 left-0 fruits">
          <img className="w-full contain" src="/img/growth_opt.png" />
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
