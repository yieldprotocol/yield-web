import React, { useState } from 'react'
import { graphql, Link } from 'gatsby'

import { filterOutDocsWithoutSlugs, mapEdgesToNodes } from '../lib/helpers'

import GraphQLErrorList from '../components/graphql-error-list'
import PageHeader from '../components/page-header'
import Container from '../components/container'
import Tabs from '../components/tabs'
import SEO from '../components/seo'

import Layout from '../containers/layout'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-600'
const HeadingClass = 'inline-block relative w-full text-xl md:text-3xl my-8'

export const query = graphql`
  query CategoriesPageQuery {
    page: sanityPage(_id: { regex: "/(drafts.|)categories/" }) {
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
  }
`

const CategoriesPage = props => {
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
      'Missing "Categories" page data. Open the studio at http://localhost:3333 and add "Categories" page data and restart the development server.'
    )
  }

  const categories = (data || {}).categories
    ? mapEdgesToNodes(data.categories).filter(filterOutDocsWithoutSlugs)
    : []

  return (
    <Layout>
      <SEO title="Categories" />
      <Container>
        <div className="inline-block relative w-full py-16 md:py-32 text-left md:text-center">
          <div className="inline-block relative w-full">
            <PageHeader
              title={page.title || `Browse by category`}
              image={page.image ? page.image : undefined}
              body={page._rawBody ? page._rawBody : undefined}
            />
            <div className="inline-block relative w-full overflow-x-auto mb-4 whitespace-no-wrap mb-8">
              <Tabs
                tabs={[
                  {
                    active: false,
                    title: 'Insights',
                    to: '/insights'
                  },
                  {
                    active: true,
                    title: 'Categories',
                    to: '/categories'
                  }
                ]}
              />
            </div>
            {categories && categories.length > 0 ? (
              <div className="inline-block relative w-full text-left max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((object, index) => (
                    <div className="inline-block relative w-full" key={`topic-${index}`}>
                      <Link
                        className="inline-block relative w-full link text-xl font-medium mb-4 underline"
                        to={`/categories/${object.slug.current}`}
                      >
                        {object.title}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="inline-block relative w-full text-center">
                <h1 className={HeadingClass}>Not categories found</h1>
                <p className={ParagraphClass}>
                  Oh no... we don't have any content on this page right now. Check back later!
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default CategoriesPage
