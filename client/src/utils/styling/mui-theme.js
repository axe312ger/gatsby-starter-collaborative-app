const { default: blue } = require('@material-ui/core/colors/blue')
const { default: red } = require('@material-ui/core/colors/red')

const typographyTheme = require('./typography')

module.exports = {
  // Default values: https://material-ui.com/customization/default-theme/
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
}
