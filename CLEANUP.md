# Cleanup Guide

This starter comes with a lot of features, luckily they are pretty much seperated an you can remove a lot of stuff you don't like with a few steps

<!-- TOC -->

- [Reset git](#reset-git)
- [Get rid of gitmoji](#get-rid-of-gitmoji)
- [Remove Prettier](#remove-prettier)

<!-- /TOC -->

## Reset git

This resets the git repository for a fresh start. You will end up with a fresh repo with a single `init` commit.

Do the following in the **root directory**:

1. `rm -rf .git`
2. `git init`
3. `git add .`
4. `git commit -m "init"`

## Get rid of gitmoji

This removes all traces to gitmoji, do the follwoing in the **root directory**:

1. `npm uninstall gitmoji-cli`
2. Remove `commit` script from `./package.json`
31. Just use your preffered way after resetting git

## Remove Prettier

Prettier can be very helpful in big teams, especially in opensource. But still: Coding style is a question of taste, so if you don't agree with what prettier does, do the following in the **client & server directory**:

1. `npm uninstall prettier`
2. Remove the `format` npm script from package.json
3. Remove the `"prettier --write --config ../.prettierrc",` entry in the `lint-staged` config in package.json
