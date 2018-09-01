const path = require(`path`)
const dotenv = require(`dotenv`)

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})
const { getPageContext } = require(`./src/utils/styling/page-context`)

const pageContext = getPageContext()

const { palette } = pageContext.theme

module.exports = {
  siteMetadata: {
    title: `Clicker`,
    description: `Example progressive web app built with Gatsby`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/styling/typography`
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: path.resolve(__dirname, `..`),
        name: `markdown-pages`
      }
    },
    `gatsby-transformer-remark`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Clicker - Gatsby Starter Collaborative App`,
        short_name: `Clicker`,
        start_url: `/`,
        background_color: palette.background.default,
        theme_color: palette.primary.main,
        display: `minimal-ui`,
        icon: `src/images/emojione-stopwatch.png`
      }
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-webpack-size`
  ]
}
