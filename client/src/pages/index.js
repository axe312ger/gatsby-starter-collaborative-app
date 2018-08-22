import { graphql, Link } from 'gatsby'
import React from 'react'
import propTypes from 'prop-types'
import Button from '@material-ui/core/Button'

import Layout from '../components/layout'

class IndexPage extends React.PureComponent {
  static propTypes = {
    data: propTypes.object.isRequired
  }
  render () {
    const { data } = this.props

    return (
      <Layout>
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
      </Layout>
    )
  }
}

export default IndexPage

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
