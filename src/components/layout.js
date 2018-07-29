import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import { MuiThemeProvider, withStyles } from '@material-ui/core/styles'

import CssBaseline from '@material-ui/core/CssBaseline'

import { getPageContext } from '../utils/PageContext'

import Header from './header'
import { SessionProvider } from './session'

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto',
    padding: '16px',
    maxWidth: '800px',
    width: '100%',
    '@media (min-width: 800px)': {
      padding: '10vh 24px'
    }
  }
}

class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    pageContext: PropTypes.object,
    classes: PropTypes.object.isRequired
  }
  pageContext = null

  constructor (props) {
    super(props)

    this.pageContext = this.props.pageContext || getPageContext()
  }
  render () {
    const { children, classes } = this.props

    return (
      <StaticQuery
        query={graphql`
          query SiteTitleQuery {
            site {
              siteMetadata {
                title
              }
            }
          }
        `}
        render={data => (
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            <CssBaseline />
            <SessionProvider>
              <Helmet
                title={data.site.siteMetadata.title}
                meta={[
                  { name: 'description', content: 'Sample' },
                  { name: 'keywords', content: 'sample, something' }
                ]}
              />
              <div className={classes.wrapper}>
                <Header siteTitle={data.site.siteMetadata.title} />
                <div className={classes.content}>{children}</div>
              </div>
            </SessionProvider>
          </MuiThemeProvider>
        )}
      />
    )
  }
}

export default withStyles(styles)(Layout)
