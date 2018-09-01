const { create, SheetsRegistry } = require('jss')

const {
  createMuiTheme,
  createGenerateClassName,
  jssPreset
} = require('@material-ui/core/styles')

const muiTheme = require('./mui-theme')

function getTheme (uiTheme) {
  const theme = createMuiTheme(uiTheme)

  // Expose the theme as a global variable so people can play with it.
  if (process.browser) {
    window.theme = theme
  }

  return theme
}

const theme = getTheme(muiTheme)

// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins] })
jss.options.insertionPoint = 'insertion-point-jss'

function createPageContext () {
  return {
    jss,
    theme,
    // This is needed in order to deduplicate the injection of CSS in the page.
    sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new SheetsRegistry(),
    generateClassName: createGenerateClassName({
      productionPrefix: 'j' // Reduce the bandwidth usage.
    })
  }
}

exports.updatePageContext = function updatePageContext (uiTheme) {
  const pageContext = {
    ...global.__MUI_PAGE_CONTEXT__,
    theme: getTheme(uiTheme)
  }
  global.__MUI_PAGE_CONTEXT__ = pageContext

  return pageContext
}

exports.getPageContext = function getPageContext () {
  // Make sure to create a new store for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return createPageContext()
  }

  // Reuse context on the client-side
  if (!global.__MUI_PAGE_CONTEXT__) {
    global.__MUI_PAGE_CONTEXT__ = createPageContext()
  }

  return global.__MUI_PAGE_CONTEXT__
}
