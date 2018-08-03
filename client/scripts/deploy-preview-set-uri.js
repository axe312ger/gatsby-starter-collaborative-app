// This is purely optional script sets the backend URI after now.sh is done deploying

const { resolve } = require('path')
const axios = require('axios')
const delay = require('delay')
const fs = require('fs-extra')
const findUp = require('find-up')

let retries = 0

async function getGitHubStatusesURI () {
  const { BRANCH } = process.env
  // Detect GH pull request for this deployment
  const match = /pull\/([0-9]+)\/head$/.exec(BRANCH)

  if (!match) {
    throw new Error(
      `Unable to extract pull request id from BRANCH env variable. Value: ${BRANCH}`
    )
  }

  // Load and extract api statuses URI
  const branchId = match[1]
  const branchResponse = await axios.get(
    `https://api.github.com/repos/axe312ger/gatsby-starter-collaborative-app/pulls/${branchId}`
  )
  return branchResponse.data.statuses_url
}

async function writeDotEnvFile ({ websocketURI, dotEnvPath }) {
  // Set backend URI in .env file
  let fileContent
  const newBackendURI = `WEBSOCKET_URI=${websocketURI}`

  // Read existing content file
  try {
    const existingFileContent = await fs.readFile(dotEnvPath)
    fileContent = existingFileContent.toString()
  } catch (e) {
    fileContent = ''
  }

  // If dotfile contains backend URI, replace it
  if (/^WEBSOCKET_URI=.*/.test(fileContent)) {
    fileContent = fileContent.replace(/^WEBSOCKET_URI=.*/, newBackendURI)
  } else {
    fileContent = newBackendURI
  }

  // Write file
  await fs.writeFile(dotEnvPath, fileContent)
}

// Waits till now passes or fails
async function discoverWebsocketURI (URI) {
  // Get all current statuses
  const statusesResponse = await axios.get(URI)
  // Extract now.sh statuses
  const nowStatuses = statusesResponse.data.filter(
    status => status.context === 'deployment/now'
  )
  // Find successful ones
  const successfulStatuses = nowStatuses.filter(
    status => status.state === 'success'
  )
  // Find failed ones
  const failedStatuses = nowStatuses.filter(status =>
    ['error', 'failure'].includes(status.state)
  )
  // Succeed if successful is found
  if (successfulStatuses.length) {
    const successData = successfulStatuses[0]
    const url = successData.target_url
    const match = /zeit\.co\/.+\/(.+)\/([a-z0-9]+)/.exec(url)
    if (!match) {
      throw new Error(`Unable to identify now deployment id from ${url}`)
    }
    return `wss://${match[1]}-${match[2]}.now.sh`
  }
  // Throw when failed is found
  if (failedStatuses.length) {
    const failedData = failedStatuses[0]
    const url = failedData.target_url
    throw new Error(`Deployment failed. See ${url}`)
  }
  // Retry if none found
  const delayTime = Math.pow(2, retries) * 1000
  retries++
  console.log(
    `No successful or failed deployment available. Retry #${retries} with ${delayTime} delay`
  )
  if (retries > 8) {
    throw new Error('Unable to find a successful now.sh deployment')
  }
  await delay(delayTime)
  return discoverWebsocketURI(URI)
}

async function run () {
  // Init env variables based on node env
  const dotEnvName = `.env.${process.env.NODE_ENV}`
  const findUpResult = await findUp(dotEnvName)
  const dotEnvPath = findUpResult || resolve(process.cwd(), dotEnvName)

  require(`dotenv`).config({
    path: dotEnvPath
  })

  // Only run on pull request builds
  if (!process.env.PULL_REQUEST) {
    throw new Error(
      'Exiting. This should run on preview deployments only. Set PULL_REQUEST to true.'
    )
  }

  const statusesURI = await getGitHubStatusesURI()
  // console.log({ statusesURI })
  const websocketURI = await discoverWebsocketURI(statusesURI)
  // console.log({ websocketURI, dotenvPath })
  await writeDotEnvFile({ websocketURI, dotEnvPath })
  return { websocketURI, dotEnvPath }
}

run()
  .then(({ websocketURI, dotEnvPath }) =>
    console.log(
      `Success! Set WEBSOCKET_URI to '${websocketURI}'\nin ${dotEnvPath}`
    )
  )
  .catch(error => {
    // Handle axios errors
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
      return
    } else if (error.request) {
      console.log(error.request)
      return
    }
    console.error(error)
  })
