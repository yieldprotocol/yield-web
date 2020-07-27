import { format, distanceInWords, differenceInDays } from 'date-fns'
import React from 'react'
import Modal from 'react-modal'
import { X } from "react-feather"

import BlockContent from './block-content'
import Button from './button'

const ParagraphClass = 'inline-block relative w-full text-sm md:text-base text-gray-600 mb-4'

if (typeof window !== 'undefined') {
  Modal.setAppElement('body')
}

class Careers extends React.Component {
  constructor(props) {
    super(props)

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.state = {
      modalIsOpen: false,
      listing: {}
    }
  }

  openModal(listing) {
    this.setState({
      modalIsOpen: true,
      listing: listing
    })
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      listing: {}
    })
  }

  render() {
    const { modalIsOpen, listing } = this.state
    const { nodes } = this.props
    return (
      <>
        <Modal
          contentLabel="Viewing career posting"
          onRequestClose={() => this.closeModal()}
          overlayClassName="modal-overlay"
          className="modal text-left text-black"
          isOpen={modalIsOpen}
        >
          <button
            className="absolute right-0 top-0 align-middle p-2 bg-black rounded-full overflow-hidden m-4 h-8 w-8 close"
            onClick={() => this.closeModal()}
          >
            <X className="h-full w-full relative" color="white" />
          </button>
          {listing ? (
            <div className="inline-block relative w-full text-white">
              {listing.title ? (
                <h2 className="text-lg md:text-xl text-white font-semibold mb-4">
                  {listing.title}
                </h2>
              ) : null}
              {listing.publishedAt ? (
                <small className="inline-block relative w-full text-gray-400 text-sm mb-4">
                  Posted on:{' '}
                  {differenceInDays(new Date(listing.publishedAt), new Date()) > 3
                    ? distanceInWords(new Date(listing.publishedAt), new Date())
                    : format(new Date(listing.publishedAt), 'MMMM Do YYYY')}
                </small>
              ) : null}
              {listing._rawBody ? (
                <div className={`${ParagraphClass} mb-8`}>
                  <BlockContent blocks={listing._rawBody || []} />
                </div>
              ) : null}
              <a
                className="inline-block relative w-full bg-black text-white px-4 py-2 link text-center"
                target="_blank"
                href={
                  listing.apply
                    ? listing.apply
                    : `mailto:careers@yield.is?subject=${
                        listing && listing.title ? listing.title : ''
                      }`
                }
                rel="noopener noreferrer"
              >
                Apply
              </a>
            </div>
          ) : (
            <div>
              <p className={ParagraphClass}>Woops, couldn't load this link, please try again!</p>
            </div>
          )}
          {/* <button
            className="inline-block relative w-full border-gray-200 border-solid px-4 py-2 link text-gray-600 text-center"
            onClick={() => this.closeModal()}
          >
            Close
          </button> */}
        </Modal>
        {nodes && nodes.length > 0 ? (
          nodes.map((career, index) => (
            <div
              className={`inline-block relative w-full py-8 text-left ${
                index === nodes.length - 1 ? '' : 'border-b border-gray-700'
              }`}
              key={`career-${index}`}
            >
              <div className="inline-block md:flex justify-between items-center w-full">
                <div className="inline-block relative w-full mr-0 md:mr-8">
                  <strong className="inline-block relative w-full text-lg md:text-xl mb-4 font-medium">
                    {career.title}
                  </strong>
                  <p className={ParagraphClass}>{career.excerpt}</p>
                </div>
                <button
                  className="inline-block relative w-full md:w-auto bg-gray-900 text-center px-4 py-2 link text-sm md:text-base"
                  onClick={() => this.openModal(career)}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="inline-block relative w-full mt-12">
            <Button outlined external text="Get in touch" to="mailto:careers@yield.is" />
          </div>
        )}
      </>
    )
  }
}

export default Careers
