import React from 'react'
import { graphql } from 'gatsby'

import GraphQLErrorList from '../components/graphql-error-list'
import PageHeader from '../components/page-header'
import Container from '../components/container'
import StoryBox from '../components/story-box'
import Slide2 from '../components/slide-2'
import Button from '../components/button'
import SEO from '../components/seo'

import Layout from '../containers/layout'

import { mapEdgesToNodes, filterOutDocsWithoutSlugs } from '../lib/helpers'

export const query = graphql`
  query ServicesPageQuery {
    page: sanityServices(_id: { regex: "/(drafts.|)services/" }) {
      id
      title
      _rawBody
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
      storiesTitle
      storiesDescription
      mainCTA
      mainCTAURL
    }

    stories: allSanityStory(limit: 4, sort: { fields: [publishedAt], order: ASC }) {
      edges {
        node {
          id
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
          logo {
            asset {
              _id
            }
            alt
          }
          title
          excerpt
          slug {
            current
          }
        }
      }
    }
  }
`

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-600 mb-12'
const HeadingClass = 'inline-block relative w-full text-xl md:text-3xl my-8'

const ServicesPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const page = data && data.page
  const storyNodes = (data || {}).stories
    ? mapEdgesToNodes(data.stories).filter(filterOutDocsWithoutSlugs)
    : []

  if (!page) {
    throw new Error(
      'Missing "Services" page data. Open the studio at http://localhost:3333 and add "Services" page data and restart the development server.'
    )
  }

  return (
    <Layout>
      <SEO title={page.title} />
      <Container>
        <div className="inline-block relative w-full py-16 md:py-32 text-left md:text-center">
          <div className="inline-block relative w-full">
            <PageHeader
              title={page.title || `Mission & values`}
              image={page.image ? page.image : undefined}
              body={page._rawBody ? page._rawBody : undefined}
            />
            {/* Slide 2 */}
            <div className="inline-block relative w-full py-12 text-left">
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
                />
                <Slide2
                  background="bg-blue-900"
                  description={page.slide2RightDescription}
                  image={page.slide2RightImage}
                  title={page.slide2RightTitle}
                  split={page.slide2}
                />
              </div>
            </div>
            {/* Stories */}
            {page.showStories ? (
              <div className="inline-block relative w-full mb-12">
                {page.storiesTitle ? <h2 className={HeadingClass}>{page.storiesTitle}</h2> : null}
                {page.storiesDescription ? (
                  <p className={ParagraphClass}>{page.storiesDescription}</p>
                ) : null}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-left">
                  {storyNodes &&
                    storyNodes.length > 0 &&
                    storyNodes.map((story, index) => (
                      <StoryBox story={story} key={`story-${index}`} />
                    ))}
                </div>
              </div>
            ) : null}
            {/* CTA */}
            {page.mainCTA ? (
              <div className="inline-block relative w-full">
                {/* page.mainCTA page.mainCTAURL */}
                <Button outlined text={page.mainCTA} to={page.mainCTAURL} />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default ServicesPage
