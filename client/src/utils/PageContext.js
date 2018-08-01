const { create, SheetsRegistry } = require('jss')
const {
  createMuiTheme,
  createGenerateClassName,
  jssPreset
} = require('@material-ui/core/styles')
const { default: blue } = require('@material-ui/core/colors/blue')
const { default: red } = require('@material-ui/core/colors/red')

const typographyTheme = require('../utils/typography')

function getTheme (uiTheme) {
  const theme = createMuiTheme(uiTheme)

  // Expose the theme as a global variable so people can play with it.
  if (process.browser) {
    window.theme = theme
  }

  return theme
}

const theme = getTheme({
  // Generate your own pallette via https://material-ui.com/style/color/#color-tool
  palette: {
    primary: {
      main: '#639'
    },
    secondary: blue,
    error: red
  },
  typography: {
    fontFamily: typographyTheme.options.headerFontFamily,
    fontSize: parseInt(typographyTheme.options.baseFontSize)
  }
})

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
