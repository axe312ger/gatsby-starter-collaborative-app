import React from 'react'
import App from '../App'
import Layout from '../components/Layout'
import { SecureSection } from '../components/session'

const AppPage = () => (
  <Layout>
    <SecureSection>
      <App />
    </SecureSection>
  </Layout>
)

export default AppPage
