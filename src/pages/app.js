import React from 'react'
import App from '../app/app'
import Layout from '../components/layout'
import { SecureSection } from '../components/session'

const AppPage = () => (
  <Layout>
    <SecureSection>
      <App />
    </SecureSection>
  </Layout>
)

export default AppPage
