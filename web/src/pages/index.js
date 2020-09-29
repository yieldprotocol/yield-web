import React from 'react'
import { graphql } from 'gatsby'
import MailchimpSubscribe from 'react-mailchimp-subscribe'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

import GraphQLErrorList from '../components/graphql-error-list'
import ContainerFull from '../components/container-full'
import SEO from '../components/seo'

import Layout from '../containers/layout'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-100 mb-8'

export const query = graphql`
  query TempPageQuery {
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
  }
`

const IndexPage = props => {
  const { data, errors } = props

  if (errors) {
    return (
      <Layout>
        <GraphQLErrorList errors={errors} />
      </Layout>
    )
  }

  const site = (data || {}).site

  if (!site) {
    throw new Error(
      'Missing "Site settings". Open the studio at http://localhost:3333 and add some content to "Site settings" and restart the development server.'
    )
  }

  const SignupForm = ({ status, message, onValidated }) => {
    let email
    const submit = e => {
      e.preventDefault()
      email &&
        email.value.indexOf('@') > -1 &&
        onValidated({
          EMAIL: email.value
        })
    }

    return (
      <form className="inline-block relative w-full" onSubmit={submit}>
        <input
          placeholder="Your email"
          className="inline-block relative w-full p-4 bg-gray-800 text-white mb-4 rounded"
          ref={node => (email = node)}
          type="email"
        />
        <button
          className="inline-block relative w-full p-4 rounded font-bold gradient-button text-white"
          onClick={submit}
          type="submit"
        >
          Submit
        </button>
        <div className="inline-block relative w-full text-xs">
          {status === 'sending' && (
            <div className="inline-block relative w-full mt-4 text-gray-600">Subscribing...</div>
          )}
          {status === 'error' && (
            <div
              className="inline-block relative w-full mt-4 text-yellow-500"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
          {status === 'success' && (
            <div
              className="inline-block relative w-full mt-4 text-green-400"
              dangerouslySetInnerHTML={{ __html: message }}
            />
          )}
        </div>
      </form>
    )
  }

  return (
    <Layout>
      <SEO
        title={site.title}
        description={site.description}
        keywords={site.keywords}
        image={
          site.image && site.image.asset && site.image.asset._id
            ? imageUrlFor(buildImageObj(site.image))
            : false
        }
      />
      <ContainerFull>
        <div className="flex items-center h-full w-full text-center mt-12 md:mt-0">
          <div className="mx-auto bg-gray-900 p-8 md:p-12 rounded w-full max-w-xl">
            <h1 className="hidden">Yield Protocol</h1>
            <div className="block mx-auto mb-8 h-6">
              <img className="inline-block relative h-full fit" src="/type-white-2.svg" />
            </div>
            <p className={ParagraphClass}>Stay up to date with Yield:</p>
            <MailchimpSubscribe
              render={({ subscribe, status, message }) => (
                <SignupForm
                  onValidated={formData => subscribe(formData)}
                  status={status}
                  message={message}
                />
              )}
              url={
                'https://yield.us8.list-manage.com/subscribe/post?u=ba7359e990d89455a1c9be0e2&amp;id=025d8e6707'
              }
            />
          </div>
        </div>
      </ContainerFull>
    </Layout>
  )
}

export default IndexPage
