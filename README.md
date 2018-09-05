# Gatsby Starter Collaborative App


> A Gatsby starter project which demonstrates how to write an app with Gatsby which supports authentication, session management, and collaborative editing

<center>

![License](https://img.shields.io/github/license/axe312ger/gatsby-starter-collaborative-app.svg)
[![CircleCI](https://img.shields.io/circleci/project/github/axe312ger/gatsby-starter-collaborative-app.svg)](https://circleci.com/gh/axe312ger/gatsby-starter-collaborative-app)
[![codecov](https://codecov.io/gh/axe312ger/gatsby-starter-collaborative-app/branch/master/graph/badge.svg)](https://codecov.io/gh/axe312ger/gatsby-starter-collaborative-app)

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

</center>


It uses the following technologies:

* Collaborative Editing: [ShareDB](https://github.com/share/sharedb)
* DB backend: [MongoDB](https://www.mongodb.com/) via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* Authentication: [Auth0](https://auth0.com/)
* Frontend & Server Side Rendering: [React](https://reactjs.org/) via [Gatsby](https://github.com/gatsbyjs/gatsby)
* Design: [Material Design (v1)](https://material.io/) with [Material UI](https://material-ui.com/) and [JSS](https://github.com/cssinjs/jss)
* Frontend Hosting: [Netlify](https://www.netlify.com/)
* Backend Hosting: [Docker](https://www.docker.com/) via [Now.sh](https://zeit.co/now)


After all, it is a combination of the following starters, tutorials & examples:

* Collaborative functionallity: https://github.com/share/sharedb/tree/master/examples/counter
* Authentification: https://auth0.com/docs/quickstart/spa/react
* Session management: https://github.com/gatsbyjs/gatsby/tree/master/examples/simple-auth
* UI: https://github.com/mui-org/material-ui/tree/master/examples/gatsby
* Forms: https://github.com/final-form/react-final-form#material-ui-10

## Mentionable frontend dependencies

* Painless form management and UX via [react-final-form](https://github.com/final-form/react-final-form)
* @todo complete this list

## TL;DR

```sh
# Install in repository root, it will automatically install the client & the server
npm ci

# For OSX, install mongodb if you don't have
# For Linux, see https://docs.mongodb.com/manual/administration/install-on-linux/
brew install mongodb

# Start client and server
npm run dev

# See ./client for the Gatsby app
# See ./server for the ShareDB API
```


You may start with the client, it is a Gatsby project with everything you need for a proper progressive web app. This takes 2 minutes.

After the client is running, set up the server locally. This takes 5 minutes.

### Client Setup

Please see the client [README.md](./client/README.md)

### Server Setup

Please see the server [README.md](./server/README.md)
