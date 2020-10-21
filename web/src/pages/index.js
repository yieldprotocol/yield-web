import React, { useState } from 'react'
import { graphql } from 'gatsby'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import Modal from 'react-modal'
import { X } from 'react-feather'

import { buildImageObj } from '../lib/helpers'
import { imageUrlFor } from '../lib/image-url'

import GraphQLErrorList from '../components/graphql-error-list'
import BlockContent from '../components/block-content'
import ContainerFull from '../components/container-full'
import Button from '../components/button'
import SEO from '../components/seo'

import Layout from '../containers/layout'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base my-8 text-gray-100'
// const ClassLinks =
//   'flex justify-start items-center relative w-full text-xs md:text-sm underline link py-1 font-light'

if (typeof window !== 'undefined') {
  Modal.setAppElement('body')
}

export const query = graphql`
  query IndexPageQuery {
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

    page: sanityHome(_id: { regex: "/(drafts.|)home/" }) {
      id
      title
      heading
      _rawBody
      mainImage {
        asset {
          _id
        }
      }
      _rawAudit
      ctaPrimary
      ctaPrimaryURL
      ctaSecondary
      ctaSecondaryURL
      stats {
        stat
        title
        description
        url
        image {
          asset {
            _id
          }
        }
      }
      showBlog
      mainCTA
      mainCTAURL
    }
  }
`

const IndexPage = props => {
  const { data, errors } = props

  const [modalIsOpen, setIsOpen] = useState(false)

  function openModal() {
    setIsOpen(true)
  }

  function closeModal() {
    setIsOpen(false)
  }

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
      'Missing "Pages > Home". Open the studio at http://localhost:3333 and add some content to "Pages > Home" and restart the development server.'
    )
  }

  const NavLinks = [
    {
      title: 'About us',
      to: '/about'
    },
    {
      title: 'White papers',
      to: '/white-papers'
    },
    {
      title: 'Careers',
      to: '/careers'
    },
    {
      external: true,
      title: 'Blog',
      to: 'https://medium.com/yield-protocol'
    }
  ]

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
          className="inline-block relative w-full p-4 bg-white text-gray-600 mb-4 rounded border border-2 border-gray-300"
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

      <Modal
        overlayClassName="modal-overlay"
        contentLabel="Mailing list"
        className="modal text-left text-black relative leading-relaxed"
        isOpen={modalIsOpen}
      >
        <button
          className="absolute right-0 top-0 align-middle p-2 bg-black rounded-full overflow-hidden m-4 close"
          onClick={() => closeModal()}
        >
          <X className="h-full w-full relative" color="white" />
        </button>
        <div className="inline-block relative w-full">
          <strong className="text-lg md:text-xl font-bold inline-block relative w-full mb-6">
            Sign up for our mailing list to keep up to date
          </strong>
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
      </Modal>

      <ContainerFull className="astronaut overlay">
        <div className="flex align-middle items-center mx-auto max-w-2xl h-full text-left md:text-center relative">
          <div className="inline-block relative w-full mb-8 md:mb-0 z-10 content">
            <h1 className="text-4xl md:text-5xl font-display">
              {page.heading || `Borrow at fixed rates. Earn predictable interest.`}
            </h1>
            <div className={`${ParagraphClass}`}>
              <BlockContent blocks={page._rawBody || []} />
            </div>
            {page.ctaPrimary || page.ctaSecondary ? (
              <div className="inline-block relative w-full mb-12">
                <div className="inline-block md:flex justify-center items-center relative w-full mb-4">
                  <Button
                    external
                    margin="mr-4 mb-4 md:mb-0"
                    text={page.ctaPrimary}
                    to={page.ctaPrimaryURL}
                  />
                  <Button
                    external
                    margin="mb-4 md:mb-0"
                    text={page.ctaSecondary}
                    to={page.ctaSecondaryURL}
                  ></Button>
                </div>
                <div className="inline-block relative w-full">
                  <button
                    className="font-bold text-base underline link bg-transparent md:w-auto"
                    onClick={() => openModal()}
                  >
                    Join our mailing list
                  </button>
                </div>
              </div>
            ) : null}
            {page._rawAudit ? (
              <div className="inline-block relative w-full">
                <div className="relative text-xs text-white opacity-75 w-full md:w-48 mx-auto">
                  <BlockContent blocks={page._rawAudit || []} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {/* Sticky fruits */}
        <div className="absolute bottom-0 right-0 left-0 fruits">
          <img className="w-full contain" src="/img/growth_opt.png" />
        </div>
      </ContainerFull>
    </Layout>
  )
}

export default IndexPage
