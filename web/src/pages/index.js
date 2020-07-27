import React, { useState } from 'react'
import { graphql } from 'gatsby'
import { ArrowLeft, ArrowRight } from 'react-feather'
import Swiper from 'react-id-swiper'

import { mapEdgesToNodes, filterOutDocsWithoutSlugs, buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

import InsightPreviewGrid from '../components/blog-post-preview-grid'
import GraphQLErrorList from '../components/graphql-error-list'
import BlockContent from '../components/block-content'
import Container from '../components/container'
import Slide2 from '../components/slide-2'
import Button from '../components/button'
import SEO from '../components/seo'

import Layout from '../containers/layout'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-600 my-8'

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
      slide2
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
      showStories
      showBlog
      mainCTA
      mainCTAURL
    }

    posts: allSanityPost(limit: 12, sort: { fields: [publishedAt], order: DESC }) {
      edges {
        node {
          id
          publishedAt
          mainImage {
            crop {
              _key
              _type
              top
              bottom
              left
              right
            }
            hotspot {
              _key
              _type
              x
              y
              height
              width
            }
            asset {
              _id
            }
            alt
          }
          title
          _rawExcerpt
          slug {
            current
          }
        }
      }
    }
  }
`

const IndexPage = props => {
  const { data, errors } = props
  const [swiper, setSwiper] = useState(null)

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

  const params = {
    rebuildOnUpdate: false,
    slidesPerView: 1,
    spaceBetween: 32,
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 32
      }
    },
    slideClass: 'swiper-slide',
    getSwiper: setSwiper,
    autoplay: true
  }

  const goNext = () => {
    if (swiper !== null) {
      swiper.slideNext()
    }
  }

  const goPrev = () => {
    if (swiper !== null) {
      swiper.slidePrev()
    }
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

  return (
    <Layout>
      <SEO
        title={site.title}
        description={site.description}
        keywords={site.keywords}
        image={
          site.image && site.image.asset && site.image.asset._id
            ? imageUrlFor(buildImageObj(site.image))
            : false
        }
      />
      <Container>
        <div className="inline-block relative w-full py-16 md:py-32">
          <div className="flex flex-wrap relative w-full">
            {/* Intro */}
            <div
              className="relative w-full"
            >
              <h1 className="inline-block relative w-full text-3xl md:text-5xl">{page.title}</h1>
              <div className={ParagraphClass}>
                <BlockContent blocks={page._rawBody || []} />
              </div>
              {/* CTAS */}
              {page.ctaPrimary || page.ctaSecondary ? (
                <div className="inline-block md:flex justify-start items-center relative w-full">
                  <Button
                    primary
                    margin="mr-4 mb-4 md:mb-0"
                    text={page.ctaPrimary}
                    to={page.ctaPrimaryURL}
                  />
                  <Button
                    external
                    outlined
                    margin="mb-8 md:mb-0"
                    text={page.ctaSecondary}
                    to={page.ctaSecondaryURL}
                  ></Button>
                </div>
              ) : null}
            </div>
            {/* Stats */}
            {page.stats && page.stats.length > 0 ? (
              <div className="inline-block relative w-full mt-24">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative w-full">
                  {page.stats.map((stat, index) => (
                    <Stat stat={stat} key={`stat-${index}`} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          {/* Slide 2 */}
          <div className="inline-block relative w-full py-12 md:py-24">
            <div
              className={`${
                page.slide2 ? 'grid gap-6 grid-cols-1 md:grid-cols-2' : 'inline-block'
              }`}
            >
              <Slide2
                background="bg-teal-900"
                description={page.slide2LeftDescription}
                image={page.slide2LeftImage}
                title={page.slide2LeftTitle}
                split={page.slide2}
                button
              />
              <Slide2
                background="bg-blue-900"
                description={page.slide2RightDescription}
                image={page.slide2RightImage}
                title={page.slide2RightTitle}
                split={page.slide2}
                button
              />
            </div>
          </div>
          {/* Blog posts */}
          {page.showBlog && postNodes && (
            <div className="inline-block relative w-full">
              <InsightPreviewGrid
                browseMoreHref="/insights/"
                title="Our insights"
                nodes={postNodes}
              />
            </div>
          )}
        </div>
      </Container>
    </Layout>
  )
}

export default IndexPage
