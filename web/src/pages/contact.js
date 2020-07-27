import React from 'react'
import { graphql } from 'gatsby'

import GraphQLErrorList from '../components/graphql-error-list'
import PageHeader from "../components/page-header"
import Container from '../components/container'
import Contact from "../components/contact"
import SEO from '../components/seo'

import Layout from '../containers/layout'

export const query = graphql`
  query ContactPageQuery {
    page: sanityPage(_id: { regex: "/(drafts.|)contact/" }) {
      id
      title
      image {
        asset {
          _id
        }
      }
      _rawBody
    }
  }
`

const ContactPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const page = data.page

  if (!page) {
    throw new Error(
      'Missing "Contact" page data. Open the studio at http://localhost:3333 and add "Contact" page data and restart the development server.'
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
            {/* Form */}
            <div className="inline-block relative w-full max-w-2xl mt-12">
              <Contact />
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default ContactPage
