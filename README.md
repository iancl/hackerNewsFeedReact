# Hacker news feed 2.0.0
This app loads the latest 10 stories and the latest 20 comments from that
story.

The Hacker News API doesn't support batch requests which means that every story
and every comment needs to be loaded in a separate request.
To avoid making 100s of requests at the time I came up wit a solution that
consists in implemeting a lazy load functionality so that we only have to 
load a small number of stories at the time. Which means less network requests 
running in parallel.

This project was created to show my react and js skills so I didn't 
spend too much working in the layout.

## what was used?:
- javascript
- react
- webpack
- grunt

## Important Notes:

For now I have only tested it in the latest versions of safari, firefox and
chrome and seems to perform fine on those browsers.

## How to setup:
1. 'nvm use'
2. npm install

## how to run:
1. 'grunt start' to start dev enviroment
2. 'grunt build' to build the project for prduction

## Updating the configuration:
The config.json file that lives in the root of the project folder can be updated
to make the feed load a greater number of stories, greater number of comments and
we can update it so that the feed shows more stories per page(stories that are
loaded after clicking on the "Load More" button).

We can also update the number of parallel requests that the fetcher makes and
the delay between every set of fetch requests.

# Todo:
- Use Bootstrap
- Add unit tests for react and add google puppeteer tests
- Fetch Polyfill
- Need to create a global config file that must contain most params
- implement esling and jscs
- Use Sass
- use jsdoc

# BUGS:
- none so far :)
