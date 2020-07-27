import React from 'react'
import { graphql } from 'gatsby'

import GraphQLErrorList from '../components/graphql-error-list'
import Container from '../components/container'
import Story from '../components/story'
import SEO from '../components/seo'

import Layout from '../containers/layout'

export const query = graphql`
  query StoryTemplateQuery($id: String!) {
    story: sanityStory(id: { eq: $id }) {
      id
      publishedAt
      categories {
        _id
        title
      }
      relatedStories {
        title
        _id
        slug {
          current
        }
        mainImage {
          asset {
            _id
          }
        }
        excerpt
      }
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
      excerpt
      slug {
        current
      }
      logo {
        asset {
          _id
        }
        alt
      }
      _rawBody
    }
  }
`

const StoryTemplate = props => {
  const { data, errors } = props
  const story = data && data.story
  return (
    <Layout>
      {errors && <SEO title="GraphQL Error" />}
      {story && <SEO title={story.title || 'Untitled'} />}

      {errors && (
        <Container>
          <GraphQLErrorList errors={errors} />
        </Container>
      )}
      {story && <Story {...story} />}
    </Layout>
  )
}

export default StoryTemplate
