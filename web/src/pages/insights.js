import React, { useState } from 'react'
import { graphql } from 'gatsby'
import Pagination from 'react-sanity-pagination'

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

export const query = graphql`
  query InsightsPageQuery {
    page: sanityPage(_id: { regex: "/(drafts.|)insights/" }) {
      id
      title
      image {
        asset {
          _id
        }
      }
      _rawBody
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
    posts: allSanityPost(sort: { fields: [publishedAt], order: DESC }) {
      edges {
        node {
          id
          publishedAt
          mainImage {
            asset {
              _id
            }
            alt
          }
          title
          _rawExcerpt
          categories {
            title
            description
          }
          slug {
            current
          }
        }
      }
    }
  }
`

const InsightsPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const page = data && data.page

  if (!page) {
    throw new Error(
      'Missing "Insights" page data. Open the studio at http://localhost:3333 and add "Insights" page data and restart the development server.'
    )
  }

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

  const categoryNodes = (data || {}).categories
    ? mapEdgesToNodes(data.categories).filter(filterOutDocsWithoutSlugs)
    : []

  const categoriesLoop = categoryNodes.map(category => ({
    active: false,
    title: category.title,
    to: `/categories/${category.slug.current}`
  }))

  let insightsTab = [
    {
      active: true,
      title: 'All',
      to: '/insights'
    }
  ]

  let tabsArray = insightsTab.concat(categoriesLoop)

  return (
    <Layout>
      <SEO title="Blog" />
      <Container>
        <div className="inline-block relative w-full py-16 md:py-32 text-left md:text-center">
          <div className="inline-block relative w-full">
            <PageHeader
              title={page.title || `Our insights`}
              image={page.image ? page.image : undefined}
              body={page._rawBody ? page._rawBody : undefined}
            />
            <div className="inline-block relative w-full overflow-x-auto mb-4 whitespace-no-wrap mb-8">
              <Tabs tabs={tabsArray} />
            </div>
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
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default InsightsPage
