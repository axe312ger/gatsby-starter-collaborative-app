# Contributing Guidelines
> :+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

*Atom Dev Team* - [CONTRIBUTING.md](https://github.com/atom/atom/blob/master/CONTRIBUTING.md)


## Code Style Quality

To ensure the same coding style is applied over all files, we use some tools which lint and format the code:

* [ESLint](https://eslint.org/) for the client
* [TSLint](https://palantir.github.io/tslint/) for the server
* [Prettier](https://prettier.io/) for both

These tools are run as `precommit` git hook to ensure all your commits follow our code style guidelines.

If your code does not apply, try the following before jumping into manually changing any code in client & server:

* client: `npm run lint -- --fix` to automatically fix eslint errors
* both: `npm run format` to reformat files you modified

## Pull Requests

Every pull request is very welcome, please make sure to provide the following:

* A description of what you want to achieve
* Ensure that your code passes all tests and GitHub integrations
* Screenshots of your changes in the PR description in case you modified the design.
* If possible, tests that cover the new or changed functionallity

**Working on your first Pull Request?** You can learn how from this *free* series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Commit conventions

The possibility to group commits to generate changelogs is a huge advantage, so many projects tend to use the [Git Commit Guidelines of the Angular.js project](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines). While we would still recommend this guidelines, I decided to use a similar, but more fun convention: [Gitmoji :sunglasses:](https://gitmoji.carloscuesta.me/)

The Gitmoji CLI is directly integrated in the root project, you may comfortabely commit via:

```sh
npm run commit
```

or anywhere via:
```sh
# Install
npm i -g gitmoji-cli

# Commit
gitmoji -c
```
