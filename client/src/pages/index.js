import React from 'react'
import Link from 'gatsby-link'
import propTypes from 'prop-types'

import Button from '@material-ui/core/Button'

import Layout from '../components/layout'
import { graphql } from 'gatsby'

const IndexPage = ({ data }) => (
  <Layout>
    <div dangerouslySetInnerHTML={{ __html: data.allFile.edges[0].node.childMarkdownRemark.html }} />
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

IndexPage.propTypes = {
  data: propTypes.object.isRequired
}

export default IndexPage
export const query = graphql`
query indexPageQuery {
  allFile (
    filter: {
      relativePath: { eq: "README.md" }
    }
  ) {
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
