import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import { withStyles } from '@material-ui/core/styles'

import withRoot from '../utils/withRoot'

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
    classes: PropTypes.object.isRequired
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
          <SessionProvider>
            <Helmet
              htmlAttributes={{
                lang: 'en'
              }}
              title={data.site.siteMetadata.title}
              meta={[
                { name: 'description', content: 'Sample' },
                { name: 'keywords', content: 'sample, something' }
              ]}
            />
            <div className={classes.wrapper} wrapper='true'>
              <Header siteTitle={data.site.siteMetadata.title} />
              <main className={classes.content} content='true'>
                {children}
              </main>
            </div>
          </SessionProvider>
        )}
      />
    )
  }
}

export default withRoot(withStyles(styles)(Layout))
