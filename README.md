# Gatsby Starter Collaborative App

> A Gatsby starter to create a feature-rich Gatsby progressive web app which supports **authentication, session management, and collaborative editing**

[![CircleCI](https://img.shields.io/circleci/project/github/axe312ger/gatsby-starter-collaborative-app.svg)](https://circleci.com/gh/axe312ger/gatsby-starter-collaborative-app)
[![codecov](https://codecov.io/gh/axe312ger/gatsby-starter-collaborative-app/branch/master/graph/badge.svg)](https://codecov.io/gh/axe312ger/gatsby-starter-collaborative-app)
[![Maintainability](https://api.codeclimate.com/v1/badges/aa1b347ee6a6746c9949/maintainability)](https://codeclimate.com/github/axe312ger/gatsby-starter-collaborative-app/maintainability)

<details>
<summary><strong>TL;DR</strong></summary>

```sh
# Install in repository root, it will automatically install the client & the server
npm ci

# For OSX, install MongoDB if you don't have
# For Linux, see https://docs.mongodb.com/manual/administration/install-on-linux/
brew install mongodb

# Start client and server
npm run dev

# See ./client for the Gatsby app
# See ./server for the ShareDB API
```

</details>

<details>
<summary><strong>Table of contents</strong></summary>

<!-- TOC -->

- [The app](#the-app)
  - [Performance](#performance)
- [Setup](#setup)
  - [Requirements](#requirements)
  - [Installation](#installation)
- [Developing](#developing)
  - [Structure](#structure)
- [Set up your own app](#set-up-your-own-app)
  - [Cleanup](#cleanup)
  - [Deployment setup](#deployment-setup)
- [Technology Stack](#technology-stack)
  - [Open Source Projects](#open-source-projects)
  - [Services](#services)
  - [Code origin](#code-origin)
- [Mentionable dependencies](#mentionable-dependencies)
- [Contributing](#contributing)

<!-- /TOC -->

</details>

## The app

Let us introduce to you: [⏱ **Clicker**](https://gatsby-starter-collaborative-app.netlify.com/)

Clicker is a very simple app where users can list, view, press and create Clickers. A Clicker is a simple button which counts +1 when it was clicked. The Clicker count is updated in real time to all clients. Users can even create private Clickers which are only visible to them.

While the feature itself seems useless, it is a wonderful simple abstraction to see how [Gatsby](https://www.gatsbyjs.com/), [Auth0](https://auth0.com/), and [ShareDB](https://github.com/share/sharedb) work together as feature-rich app ecosystem. It is based on the [Counter example by ShareDB](https://github.com/share/sharedb/tree/master/examples/counter).

It should be a minimal effort to transform the data structure and user interface to any collaborative idea in your mind.

### Performance

![Lighthouse Score](https://img.shields.io/badge/Lighthouse-100/100-green.svg?longCache=true&colorA=242ffd&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAIAAAAC64paAAAC/ElEQVR4AY2SA5QsVxCG/7q3e9CzGqye/V5s27ZtG4dxcpwcxbZt207Wtr07blXFmt0k72tclouWb+TjDwi/IIACCGiFArAKLAADhEIMK8gsYCYRsBALSOADQ1AnqB6BvMZLYhCCyCx5AgRhII6qCIpCYhpsaf7ONx8KPHOgeWTSxeveE+c4R68D3wEVCt90Y03fYFnfYHHvULhhIJjrIACHl/ffZS1UaaQ0/BCuL2t/gJavA8+B+ru8cdn5N8C1srnSVCY2NZOYmooOTVblGtJ6ncNDJbnQeFLSo9UvzqALZAH8z5jFjpJhW2VDVqK9UuUAAXLvVVyeW2fz0kQbRrU9Hv32wxVGHiiaLQw/OVMxPVM+OlE5OFw5MJSo76zaAd/tuPvnrs/5xkEn17bPyCdvR/YTvzBm44Irr2vrLm3ttXo6NdL4jaN2fESNv5zsW+V80e9Z2eWLv0dgPxEUQIhJLIoyS8JB1loUYTqvdoiNnHZil2kpNxh2Xf/R+6tfbK+uKmLPB+Ev1HrLvYoyX2vJu5TOqayjcil0RKrHl24wuWC1KbK6/SOdxIwJg7mwSfKO+qu9CApwheIBe2H/j0ua34q3vKrtmrjsDaqeo8MKtjTzZNhYPDa02ctnaSfDRgwGgmRjLlTBmn79IpzR3Av2nUh17053TK1ahCRYUaFlzIZQJDknvk33eicPLN3MjUa5O4y8iCL4/ynMmjCJma0WfXXYLdOBhPZ9k8QMArwWbosCPM6XR7KRUoYw/AVdX67pr0WCSHgOt4UEWkAAEzyFQSomM57JRlvq5tW/E+69vWfqCThbaUORKaIFAjARkyEGk6sxTkgCUaAqj13tgK7RNXekhz5qLolHNlk8ODmG7qQ3ZWIkTJNABIiLBH1aUSUSY96sh9dp9Oc3Slk3W8Nh3feLNjMGCMRL+BL0SiRXpaaXqMF1dMu66vulNGDQkgu/c3d8iis/FHOIJAQuJg45ElZQIfYA+EQ+hJQLykGnhTLklauxHc0vj/wJ/k92/rQz1oQAAAAASUVORK5CYII=)

It is fast. Client and deployments are done in 60 seconds due to [Netlify](https://www.netlify.com/) and [Now](https://zeit.co/now). Gatsby does fully unleash its optimization powers.

@todo create separate PERFORMANCE.md and add lighthouse screenshot, webpagetest result & webpack stats


## Setup

### Requirements

You are required to use **Node Version 10** since this project depends on the latest features and performance improvements.

<details>
<summary>Not on Node v10 yet?</summary>

* We recommend to use: https://github.com/creationix/nvm
* The normal way works as well: https://nodejs.org/en/download/current/

</details>

Currently, the whole project is tested on OSX only. Bugfixes to get it running smoothly on Linux and Windows are very welcome.

### Installation

**Via gatsby-cli:**
```sh
gatsby new collaborative-app https://github.com/axe312ger/gatsby-starter-collaborative-app
cd collaborative-app
```

<details>
<summary><strong>The good old manual way:</strong></summary>

```sh
git clone https://github.com/axe312ger/gatsby-starter-collaborative-app collaborative-app
cd collaborative-app
npm install
```

</details>

All node dependencies for server & client are installed automatically.

**One more thing:** You need to have [MongoDB](https://www.mongodb.com/) installed for data storage. See the  [server README.md](./server/README.md) for instructions how to do that.

## Developing

After installation, you might start the client & server at once via:

```sh
npm run dev
```

This will:
* Run `gatsby develop` in the client directory
* Start MongoDB
* Start the actual backend Server

### Structure

The root directory acts as a wrapper for the client and server projects and primarily provides scripts to improve the developing and maintenance experience.

It is up to you to keep these bundled or you may just separate them. Both approaches have pros and cons.

You might first want to look into the `./client` directory which is the actual Gatsby App.

The `server` directory provides a simple API server with Auth0 authentification and ShareDB with MongoDB.

@todo create dig deeper section into most important code files. Consider extra file for this.

## Set up your own app

@todo provide guidance on how to set up your own app based on this starter.

### Cleanup

You might not agree with how some things are done in this repo. No problem, here are some tips on how to get rid of several things: [CLEANUP.md](./CLEANUP.md)

### Deployment setup

@todo add DEPLOYMENT.md for this

## Technology Stack

The project is heavily based on well-known open source projects and cloud hosting services. The focus was to reduce server maintenance to a minimum.

### Open Source Projects

* Frontend & Server Side Rendering: [React](https://reactjs.org/) via [Gatsby](https://github.com/gatsbyjs/gatsby)
* Collaborative Editing: [ShareDB](https://github.com/share/sharedb)
* DB: [MongoDB](https://www.mongodb.com/)
* Design: [Material Design (v1)](https://material.io/) with [Material UI](https://material-ui.com/) and [JSS](https://github.com/cssinjs/jss)


### Services

* Frontend Hosting: [Netlify](https://www.netlify.com/)
* Backend Hosting: [Docker](https://www.docker.com/) via [Now.sh](https://zeit.co/now)
* Authentication: [Auth0](https://auth0.com/)
* Production database: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Code origin

After all, it is a combination of the following starters, tutorials & examples:

* Collaborative functionality: https://github.com/share/sharedb/tree/master/examples/counter
* Authentification: https://auth0.com/docs/quickstart/spa/react
* Session management: https://github.com/gatsbyjs/gatsby/tree/master/examples/simple-auth
* UI: https://github.com/mui-org/material-ui/tree/master/examples/gatsby
* Forms: https://github.com/final-form/react-final-form#material-ui-10

## Mentionable dependencies

Just because they rule and deserve a mention :)

* Painless form management and UX via [react-final-form](https://github.com/final-form/react-final-form)
* @todo complete this list

## Contributing

![License](https://img.shields.io/github/license/axe312ger/gatsby-starter-collaborative-app.svg?longCache=true)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?longCache=true)](http://makeapullrequest.com)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?longCache=true)](https://github.com/prettier/prettier)

You are very welcome to contribute. Please have a look at our [Contributing Guidelines](./CONTRIBUTING.md)
