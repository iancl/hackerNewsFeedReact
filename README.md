# Hacker news feed
This app loads the latest 10 stories and the latest 20 comments from that
story.

## what was used?:
- javascript
- react
- webpack
- grunt

## Important Notes:
I found that the hackerNews API is not very stable mainly due to the fact that
they don't seem to support batch requests, I mean, request the data for a
set of items in one request

This makes the request and some request related promises fail after reloading
the app multiple times. Or at least this seems to be the problem.

I found that the higher volume of requests, the sooner it will start failing.

At some point I was going to implement some lazy load functionality but
I found that this happens even when loading 1 single story.

in order to increase the # of stories to load, please go to
'src/tools/dataManager.js' and change the value of the MAX_STORIES
constant.

## How to setup:
1. 'nvm use'
2. npm install

## how to run
1. 'grunt start' to start dev enviroment
2. 'grunt build' to build the project for prduction

# Todo:
- Use Bootstrap
- Add unit tests for react and add google puppeteer tests
- Fetch Polyfill
- Need to create a global config file that must contain most params
- implement esling and jscs
- Use Sass
- use jsdoc
