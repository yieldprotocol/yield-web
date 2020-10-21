import React from 'react'
import { graphql } from 'gatsby'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

import GraphQLErrorList from '../components/graphql-error-list'
import BlockContent from '../components/block-content'
import Container from '../components/container'
import SEO from '../components/seo'

import Layout from '../containers/layout'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base my-8 text-gray-100'

export const query = graphql`
  query FaqPageQuery {
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

    page: sanityFaqs(_id: { regex: "/(drafts.|)faqs/" }) {
      id
      title
      heading
      _rawBody
      faq {
        title
        _rawBody
        url
        image {
          asset {
            _id
          }
        }
      }
      mainCTA
      mainCTAURL
    }
  }
`

const FaqPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const site = (data || {}).site
  const page = (data || {}).page

  if (!site) {
    throw new Error(
      'Missing "Site settings". Open the studio at http://localhost:3333 and add some content to "Site settings" and restart the development server.'
    )
  }

  if (!page) {
    throw new Error(
      'Missing "Pages > FAQs". Open the studio at http://localhost:3333 and add some content to "Pages > FAQs" and restart the development server.'
    )
  }

  return (
    <Layout dark>
      <SEO
        title={page.title}
        description={site.description}
        keywords={site.keywords}
        image={
          site.image && site.image.asset && site.image.asset._id
            ? imageUrlFor(buildImageObj(site.image))
            : false
        }
      />
      <Container>
        <div className="block mx-auto max-w-2xl h-full text-left md:text-center md:text-center relative py-16 md:py-32">
          <div className="inline-block relative w-full mb-8 md:mb-0 z-10 content">
            <h1 className="text-4xl md:text-5xl font-display">{page.heading || `FAQs.`}</h1>
            {page._rawBody ? (
              <div className={`${ParagraphClass}`}>
                <BlockContent blocks={page._rawBody || []} />
              </div>
            ) : null}
            {page.faq && page.faq.length > 0 ? (
              <Accordion
                allowMultipleExpanded
                className="inline-block relative w-full my-4 text-left leading-loose"
              >
                {page.faq.map((faq, index) => (
                  <AccordionItem
                    className="mx-auto max-w-xl border-b-2 border-gray-800 py-4 md:py-8"
                    key={`faq-${index}`}
                  >
                    <AccordionItemHeading className="inline-block relative w-full font-bold font-display mb-4 text-lg">
                      <AccordionItemButton>{faq.title}</AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <div className="inline-block relative w-full text-sm text-gray-400">
                        <BlockContent blocks={faq._rawBody || []} />
                      </div>
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="inline-block relative w-full">
                <p>Ah shoot... nothing here</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  )
}

export default FaqPage
