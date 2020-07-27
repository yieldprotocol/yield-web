require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})
const {
  api: { projectId, dataset }
} = requireConfig('../studio/sanity.json')

module.exports = {
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-postcss',
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [require('tailwindcss')]
      }
    },
    {
      resolve: 'gatsby-plugin-gtag',
      trackingId: process.env.GATSBY_GA_ID,
      // Setting this parameter is optional
      anonymize: true
    },
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static/`,
        name: 'uploads'
      }
    },
    {
      resolve: 'gatsby-plugin-netlify',
      options: {
        headers: {
          '/*': [
            'Access-Control-Allow-Origin: *',
            'X-XSS-Protection: 0;',
            'X-Frame-Options: ALLOWALL'
          ]
        },
        mergeSecurityHeaders: true, // boolean to turn off the default security headers
        mergeLinkHeaders: true, // boolean to turn off the default gatsby js headers
        mergeCachingHeaders: true, // boolean to turn off the default caching headers
        transformHeaders: (headers, path) => headers, // optional transform for manipulating headers under each path (e.g.sorting), etc.
        generateMatchPathRewrites: true // boolean to turn off automatic creation of redirect rules for client only paths
      }
    },
    {
      resolve: 'gatsby-source-sanity',
      options: {
        // To enable preview of drafts, copy .env-example into .env,
        // and add a token with read permissions
        overlayDrafts: true,
        projectId: process.env.SANITY_PROJECT_ID,
        watchMode: true,
        dataset: process.env.SANITY_DATASET,
        token: process.env.SANITY_TOKEN
      }
    }
  ]
}

/**
 * We're requiring a file in the studio folder to make the monorepo
 * work "out-of-the-box". Sometimes you would to run this web frontend
 * in isolation (e.g. on codesandbox). This will give you an error message
 * with directions to enter the info manually or in the environment.
 */

function requireConfig(path) {
  try {
    return require(path)
  } catch (e) {
    console.error(
      'Failed to require sanity.json. Fill in projectId and dataset name manually in gatsby-config.js'
    )
    return {
      api: {
        projectId: process.env.SANITY_PROJECT_ID || '',
        dataset: process.env.SANITY_DATASET || ''
      }
    }
  }
}
