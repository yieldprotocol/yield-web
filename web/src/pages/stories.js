import React from 'react'
import { graphql } from 'gatsby'

import GraphQLErrorList from '../components/graphql-error-list'
import StoryPreviewGrid from '../components/story-preview-grid'
import Container from '../components/container'
import SEO from '../components/seo'

import Layout from '../containers/layout'

import { mapEdgesToNodes, filterOutDocsWithoutSlugs } from '../lib/helpers'

export const query = graphql`
  query StoriesPageQuery {
    stories: allSanityStory(limit: 12, sort: { fields: [publishedAt], order: DESC }) {
      edges {
        node {
          id
          mainImage {
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

const ProjectsPage = props => {
  const { data, errors } = props
  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }
  const storyNodes =
    data && data.stories && mapEdgesToNodes(data.stories).filter(filterOutDocsWithoutSlugs)
  return (
    <Layout>
      <SEO title="Stories" />
      <Container>
        <h1>Stories</h1>
        {storyNodes && storyNodes.length > 0 && <StoryPreviewGrid nodes={storyNodes} />}
      </Container>
    </Layout>
  )
}

export default ProjectsPage
