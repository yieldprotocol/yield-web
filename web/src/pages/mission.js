import React from 'react'
import { graphql } from 'gatsby'

import GraphQLErrorList from '../components/graphql-error-list'
import BlockContent from '../components/block-content'
import PageHeader from "../components/page-header"
import Container from '../components/container'
import SEO from '../components/seo'

import Layout from '../containers/layout'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

export const query = graphql`
  query MissionPageQuery {
    page: sanityMission(_id: { regex: "/(drafts.|)mission/" }) {
      id
      title
      image {
        asset {
          _id
        }
      }
      _rawBody
      values {
        title
        _rawDescription
        image {
          asset {
            _id
          }
        }
      }
    }
  }
`

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-600'
const HeadingClass = 'inline-block relative w-full text-xl md:text-3xl my-8'

const MissionPage = props => {
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
      'Missing "Mission" page data. Open the studio at http://localhost:3333 and add "Mission" page data and restart the development server.'
    )
  }

  const Value = ({ value, last }) => (
    <div className={`inline-block relative w-full py-8 ${last ? '' : 'border-b border-gray-700'}`}>
      <div className="flex justify-between items-top">
        {value.image && value.image.asset._id ? (
          <div className="w-8 h-8 text-white mr-8 rounded-sm overflow-hidden">
            <img
              className="inline-block w-full fit"
              src={imageUrlFor(buildImageObj(value.image)).url()}
            />
          </div>
        ) : null}
        <div className="inline-block relative w-full">
          <strong className="inline-block relative w-full text-lg md:text-xl mb-4 font-medium">
            {value.title}
          </strong>
          {value._rawDescription && (
            <div className={`${ParagraphClass} list`}>
              <BlockContent blocks={value._rawDescription} />
            </div>
          )}
        </div>
      </div>
    </div>
  )

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
            <div className="inline-block relative w-full max-w-2xl">
              {page.values && page.values.length > 0 ? (
                <div className="inline-block relative w-full">
                  <h2 className={HeadingClass}>Our values</h2>
                  <div className="inline-block relative w-full text-left">
                    {page.values.map((value, index) => (
                      <Value
                        value={value}
                        last={index === page.values.length - 1}
                        key={`value-${index}`}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default MissionPage
