import React from 'react'
import { graphql } from 'gatsby'

import GraphQLErrorList from '../components/graphql-error-list'
import PageHeader from '../components/page-header'
import PeopleGrid from '../components/people-grid'
import Container from '../components/container'
import Careers from '../components/careers'
import Button from '../components/button'
import SEO from '../components/seo'

import Layout from '../containers/layout'

import { mapEdgesToNodes, filterOutDocsWithoutSlugs } from '../lib/helpers'

export const query = graphql`
  query AboutPageQuery {
    page: sanityAbout(_id: { regex: "/(drafts.|)about/" }) {
      id
      title
      image {
        asset {
          _id
        }
      }
      _rawBody
      careers
      careersCTA
      careersDest
    }
    people: allSanityPerson(sort: { fields: [_createdAt], order: ASC }) {
      edges {
        node {
          id
          image {
            asset {
              _id
            }
          }
          name
          title
          _rawBio
          slug {
            current
          }
        }
      }
    }
    careers: allSanityCareer(limit: 4, sort: { fields: [publishedAt], order: ASC }) {
      edges {
        node {
          id
          publishedAt
          title
          excerpt
          _rawBody
          slug {
            current
          }
          apply
        }
      }
    }
  }
`

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-600'
const HeadingClass = 'inline-block relative w-full text-xl md:text-3xl my-8'

const AboutPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const page = data && data.page
  const personNodes =
    data && data.people && mapEdgesToNodes(data.people).filter(filterOutDocsWithoutSlugs)
  const careerNodes =
    data && data.careers && mapEdgesToNodes(data.careers).filter(filterOutDocsWithoutSlugs)

  if (!page) {
    throw new Error(
      'Missing "About" page data. Open the studio at http://localhost:3333 and add "About" page data and restart the development server.'
    )
  }

  return (
    <Layout>
      <SEO title={page.title} />
      <Container>
        <div className="inline-block relative w-full py-16 md:py-32 text-left md:text-center">
          <div className="inline-block relative w-full">
            <PageHeader
              title={page.title || `About us`}
              image={page.image ? page.image : undefined}
              body={page._rawBody ? page._rawBody : undefined}
            />
            {personNodes && personNodes.length > 0 ? (
              <div className="inline-block relative w-full">
                <PeopleGrid items={personNodes} title="Our team" />
              </div>
            ) : null}
            <div className="inline-block relative w-full max-w-2xl">
              <h4 className={HeadingClass}>Careers</h4>
              <p className={`${ParagraphClass} mb-8`}>{page.careersCTA}</p>
              {page.careers ? (
                <div className="inline-block relative w-full">
                  <Careers nodes={careerNodes} />
                  <Button outlined text="See all careers" to="/careers" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default AboutPage
