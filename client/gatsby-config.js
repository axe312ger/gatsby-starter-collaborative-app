require(`dotenv`).config({
  path: `.env.${process.env.NODE_ENV}`
})
const { getPageContext } = require('./src/utils/PageContext')

const pageContext = getPageContext()

const { palette } = pageContext.theme

module.exports = {
  siteMetadata: {
    title: `Collaborative App`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Collaborative App`,
        short_name: `⚛️📄🚀📱👆`,
        start_url: `/`,
        background_color: palette.background.default,
        theme_color: palette.primary.main,
        display: `minimal-ui`,
        icon: `src/images/gatsby-logo.svg`
      }
    },
    `gatsby-plugin-offline`
  ]
}
