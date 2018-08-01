import React from 'react'
import Link from 'gatsby-link'

import Button from '@material-ui/core/Button'

import Layout from '../components/layout'

const IndexPage = () => (
  <Layout>
    <h1>Gatsby Starter Collaboration</h1>
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

export default IndexPage
