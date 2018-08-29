import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { StaticQuery, graphql } from 'gatsby'

import { withStyles } from '@material-ui/core/styles'

import withRoot from '../utils/withRoot'

import Drawer from './drawer'
import Header from './header'
import { SessionProvider } from './session'

const styles = theme => ({
  wrapper: {
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gridTemplateColumns: '100%',
    height: '100vh'
  },
  content: {
    margin: '0 auto',
    maxWidth: '800px',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      ...theme.mixins.gutters(),
      paddingBottom: theme.spacing.unit * 2
    }
  }
})

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
              link={[
                {
                  rel: 'apple-touch-icon',
                  href: '/apple-touch-icon.png'
                }
              ]}
              meta={[
                {
                  name: 'description',
                  content: data.site.siteMetadata.description
                },
                { name: 'apple-mobile-web-app-capable', content: 'yes' },
                {
                  name: 'apple-mobile-web-app-status-bar-style',
                  content: 'black-translucent'
                },
                { name: 'format-detection', content: 'telephone=no' }
              ]}
            />
            <div className={classes.wrapper} wrapper='true'>
              <Header siteTitle={data.site.siteMetadata.title} />
              <main className={classes.content} content='true'>
                {children}
              </main>
            </div>
            <Drawer />
          </SessionProvider>
        )}
      />
    )
  }
}

export default withRoot(withStyles(styles)(Layout))
