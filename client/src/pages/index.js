import { graphql, Link } from 'gatsby'
import React from 'react'
import propTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

import Layout from '../components/Layout'

const styles = (theme) => ({
  wrapper: {
    ...theme.mixins.gutters(),
    padding: `${theme.spacing.unit * 2}px 0`
  }
})

class IndexPage extends React.PureComponent {
  static propTypes = {
    data: propTypes.object.isRequired,
    classes: propTypes.object.isRequired
  }
  render () {
    const { classes, data } = this.props

    return (
      <Layout>
        <div className={classes.wrapper}>
          <div
            dangerouslySetInnerHTML={{
              __html: data.allFile.edges[0].node.childMarkdownRemark.html
            }}
          />
          <Button
            component={Link}
            to='/login'
            variant='raised'
            size='large'
            color='primary'
          >
            Login / Register
          </Button>
        </div>
      </Layout>
    )
  }
}

export default withStyles(styles)(IndexPage)

export const query = graphql`
  query indexPageQuery {
    allFile(filter: { relativePath: { eq: "README.md" } }) {
      edges {
        node {
          id
          parent {
            id
          }
          sourceInstanceName
          relativePath
          childMarkdownRemark {
            html
          }
        }
      }
    }
  }
`
