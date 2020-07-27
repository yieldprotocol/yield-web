import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Pagination from 'react-sanity-pagination'
import { globalHistory as history } from '@reach/router'

import InsightPreviewGrid from '../components/blog-post-preview-grid'
import GraphQLErrorList from '../components/graphql-error-list'
import PageHeader from '../components/page-header'
import Container from '../components/container'
import Tabs from '../components/tabs'
import SEO from '../components/seo'

import Layout from '../containers/layout'

import {
  filterOutDocsWithoutSlugs,
  filterOutDocsPublishedInTheFuture,
  mapEdgesToNodes
} from '../lib/helpers'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-600'
const HeadingClass = 'inline-block relative w-full text-xl md:text-3xl mb-8'

export const query = graphql`
  query CategoryTemplateQuery($title: String!, $slug: String!) {
    category: sanityCategory(title: { eq: $title }) {
      id
      title
    }
    categories: allSanityCategory(sort: { fields: [title], order: ASC }) {
      edges {
        node {
          id
          title
          slug {
            current
          }
        }
      }
    }
    posts: allSanityPost(
      filter: { categories: { elemMatch: { slug: { current: { eq: $slug } } } } }
    ) {
      edges {
        node {
          id
          title
          _rawExcerpt
          publishedAt
          slug {
            current
          }
          mainImage {
            asset {
              _id
            }
            alt
          }
        }
      }
    }
  }
`

const CategoryTemplate = props => {
  const { data, errors } = props
  const category = data && data.category

  // Create a variable for the amount of posts you want per page
  const postsPerPage = 48
  // Create state which will be updated every time you paginate
  const [items, setItems] = useState([])

  // Fetch all data initially
  const postNodes = (data || {}).posts
    ? mapEdgesToNodes(data.posts)
        .filter(filterOutDocsWithoutSlugs)
        .filter(filterOutDocsPublishedInTheFuture)
    : []

  // Create an action which will be called on paginate
  // This will return the current Page, Range of items and the Items to render
  const action = (page, range, items) => {
    // Update State
    setItems(items)
  }

  // Handle route change
  const { location } = history
  const substring = location.pathname.replace('/categories/', '')

  const categoryNodes = (data || {}).categories
    ? mapEdgesToNodes(data.categories).filter(filterOutDocsWithoutSlugs)
    : []

  const categoriesLoop = categoryNodes.map(category => ({
    active: substring === category.title.toLowerCase().replace(' ', '-'),
    title: category.title,
    to: `/categories/${category.slug.current}`
  }))

  let insightsTab = [
    {
      active: false,
      title: 'All',
      to: '/blog'
    }
  ]

  let tabsArray = insightsTab.concat(categoriesLoop)

  return (
    <Layout>
      {errors && <SEO title="GraphQL Error" />}
      {category && <SEO title={category.title || 'Untitled'} />}

      {errors && (
        <Container>
          <GraphQLErrorList errors={errors} />
        </Container>
      )}

      {category && (
        <Container>
          <div className="inline-block relative w-full py-16 md:py-32 text-left md:text-center">
            <div className="inline-block relative w-full">
              <PageHeader
                title={category.title || `Our insights`}
              />
              <div className="inline-block relative w-full overflow-x-auto mb-4 whitespace-no-wrap mb-8">
                <Tabs tabs={tabsArray} />
              </div>
              {items ? (
                <div className="inline-block relative w-full text-left">
                  {items && (
                    <>
                      <InsightPreviewGrid nodes={items} />
                      {/* Props required: action, items, postsPerPage */}
                      <Pagination
                        nextButtonLabel={'Next'}
                        prevButtonLabel={'Prev'}
                        postsPerPage={postsPerPage}
                        action={action}
                        items={postNodes}
                        nextButton
                        prevButton
                      />
                    </>
                  )}
                </div>
              ) : (
                <div className="inline-block relative w-full text-center">
                  <h1 className={HeadingClass}>Not posts found</h1>
                  <p className={ParagraphClass}>
                    Oh no... we don't have any content on this page right now. Check back later!
                  </p>
                </div>
              )}
            </div>
          </div>
        </Container>
      )}
    </Layout>
  )
}

export default CategoryTemplate
