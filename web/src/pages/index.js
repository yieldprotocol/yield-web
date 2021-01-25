import React, { useState } from 'react'
import { graphql } from 'gatsby'
import MailchimpSubscribe from 'react-mailchimp-subscribe'
import Modal from 'react-modal'
import { X } from 'react-feather'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import Select from 'react-select'

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

const borrow = {
  heading: 'Borrow today & pay fixed interest.',
  type: 'borrow',
  cta: 'Borrow'
}

const lend = {
  heading: 'Lend today & earn fixed interest.',
  type: 'lend',
  cta: 'Lend'
}

const series = [
  {
    value: '1617235199',
    label: 'March 2021 • APR: 3.86',
    date: 'March 2021',
    apr: 3.86
  },
  {
    value: '1625097599',
    label: 'June 2021 • APR: 3.61',
    date: 'June 2021',
    apr: 3.61
  },
  {
    value: '1633046399',
    label: 'September 2021 • APR: 2.84',
    date: 'September 2021',
    apr: 2.84
  },
  {
    value: '1640995199',
    label: 'December 2021 • APR: 3.84',
    date: 'December 2021',
    apr: 3.84
  }
]

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
  const [selectedSeries, setSelectedSeries] = useState(series[0])
  const [amount, setAmount] = useState(100)
  const [rate, setRate] = useState(0)
  const [tab, setTab] = useState(borrow)

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
          className="inline-block relative w-full p-4 rounded font-bold bg-indigo-700 text-white"
          onClick={submit}
          type="submit"
        >
          Submit
        </button>
        {status ? (
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
        ) : null}
      </form>
    )
  }

  const switchTabs = index => {
    let tab
    switch (index) {
      case 1:
        tab = lend
        break
      default:
        tab = borrow
        break
    }
    console.log('Switched to:', tab)
    setTab(tab)
    return tab
  }

  const formSubmit = e => {
    e.preventDefault()
    console.log('form submitted, amount, series, tab', amount, selectedSeries, tab)
    if (typeof window) {
      window.open(`//app.yield.is/#/${tab.type}/${selectedSeries.value}/${amount}`)
    }
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

      <ContainerFull padding="p-0">
        <div className="h-full app">
          {/* Form */}
          <div className="h-full pt-32 pb-4 md:py-32 px-5 md:px-12 series text-center">
            <div className="block mx-auto max-w-xs mb-4 md:mb-8">
              <p className="text-orange-300 font-bold tracking-widest text-3xl uppercase m-0">
                {selectedSeries.date}
              </p>
              <h1 className="text-6xl font-semibold p-0 m-0">{selectedSeries.apr}%</h1>
              <p className="text-xl font-normal mb-8 text-indigo-200">Fixed rate interest</p>
              <strong class="block text-xs uppercase text-indigo-600 tracking-widest mb-2">
                Change series
              </strong>
              <Select
                className="select"
                isSearchable={false}
                onChange={setSelectedSeries}
                isMulti={false}
                options={series}
                value={selectedSeries}
              />
              <Tabs className="my-8" onSelect={index => switchTabs(index)}>
                <TabList className="flex align-middle justify-center rounded-full w-auto">
                  <Tab>{borrow.cta}</Tab>
                  <Tab>{lend.cta}</Tab>
                </TabList>
              </Tabs>
              <form onSubmit={e => formSubmit(e)}>
                <label htmlFor="amount">Amount of DAI to {tab.cta}</label>
                <input
                  className="inline-block relative w-full px-2 py-1 bg-transparent border-2 rounded-md border-indigo-500"
                  type="number"
                  onChange={event => setAmount(event.target.value)}
                  value={amount}
                  id="amount"
                />
              </form>
            </div>
          </div>
          {/* Right  */}
          <div className="h-full py-12 md:py-48 px-5 md:px-12 bg-indigo-800 interest">
            <h2 className="text-2xl font-semibold">{tab.heading}</h2>
            <button
              className="inline-block relative w-full rounded-md bg-white text-indigo-700 font-bold py-4 px-8 my-8 link"
              onClick={e => formSubmit(e)}
            >
              {tab.cta} {amount} DAI
            </button>
            <p className="text-sm text-gray-500 tracking-wide mb-8">
              Interest rates &amp; slippage are subject to changes from market volatility. Your
              final transaction will not be completed if the rate becomes unfavorable.
            </p>
            <button
              className="inline-block relative w-full py-2 text-sm underline text-left"
              onClick={() => openModal()}
            >
              Sign up for our mailing list
            </button>
          </div>
        </div>
      </ContainerFull>
    </Layout>
  )
}

export default IndexPage
