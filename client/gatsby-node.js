exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  if (page.path.match(/^\/app/)) {
    page.matchPath = '/app/*'

    createPage(page)
  }
}
exports.onCreateWebpackConfig = ({ stage, plugins, actions }) => {
  if (stage !== 'build-html') {
    return
  }
  actions.setWebpackConfig({
    plugins: [
      // https://github.com/gatsbyjs/gatsby/issues/2615
      plugins.define({
        'global.GENTLY': false
      })
    ]
  })
}
