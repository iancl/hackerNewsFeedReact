// TODO: All of these should be in a config file
const LATEST_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories' +
    '.json?print=pretty';
const ITEM_URL = 'https://hacker-news.firebaseio.com/v0/item/{id}' +
    '.json?print=pretty';
const MAX_COMMENTS = 20;
const PROMISE_CHUNK_SIZE = 2;

// ** IMPORTANT **
// I found that the hackerNews API is not very stable mainly due to the fact that
// they don't seem to support batch requests, I mean, request the data for a
// set of items in one request

// This makes the request and some request related promises fail after reloading
// the app multiple times. Or at least this seems to be the problem.

// I found that the higher volume of requests, the sooner it will start failing.

// At some point I was going to implement some lazy load functionality but
// I found that this happens even when loading 1 single story.

// in order to increase the # of stories to load, please change the value
// of the MAX_STORIES constant.
const MAX_STORIES = 10; // MIN VALUE is 2 so it matches with PROMISE_CHUNK_SIZE

// this is a way to log messages without polluting the console
window.DataManagerErrorQueue = [];

/**
 * Pushes messages to the DataManagerErrorQueue array
 * TODO: This could be moved to a utils module
 * @param {*} arg
 */
function log(arg) {
    window.DataManagerErrorQueue.push(arg);
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param arr {Array} Array to split
 * @param chunkSize {Int}
 */
function getArrayChunks(arr, chunkSize) {
    let results = [];
    
    while (arr.length) {
        results.push(arr.splice(0, chunkSize))
    }

    return results;
}

/**
 * DRY function to fetch data
 * @param {String} url 
 * @returns {Promise}
 */
function doFetch(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then((response) => {
            // Assuming we're only going to get 404 and 200 statuses
            // this is a blocking error
            if (response.status !== 200) {
                console.error(`Fetch error: ${response.statusText}`);
                reject();
            }

            return response.json();
        })
        .then((data) => {
            resolve(data);
        })
        .catch((err) => {
            console.error(err);
            reject();
        });
    });
}

/**
 * Data Manager class
 * In charge of fetching all the data needed to the app for rendering
 * This class will:
 * 
 * 1. Load all top story ids
 * 2. Store the first n stories. See MAX_STORIES const
 * 3. get the details and comments of 10 of them every time the
 * 
 */
class DataManager extends Object {
    constructor() {
        super();

        this.storyIds = [];
        this.fetchedStoryCount = 0;
    }

    /**
     * Fetches top stories and stores the first n comments.
     * see MAX_COMMENTS constant
     * @returns {Promise}
     */
    loadTopStoryIds() {
        // Attempting to get latest story ids
        log('attempting to load latest stories');

        return new Promise((resolve, reject) => {
            doFetch(LATEST_STORIES_URL)
                .then((data) => {
                    // store ids
                    this.storyIds = data.slice(0, MAX_STORIES);
                    resolve();
                    log({'Fetched top storiy ids': this.storyIds});
                })
                .catch(() => {
                    reject();
                });
        });
    }

    /**
     * Fetches a single promise
     * @param {String} id 
     */
    fetchCommentPromise(url) {
        return new Promise((resolve, reject) => {
            doFetch(url)
                .then((data) => {
                    resolve(data);
                })
                .catch(() => {
                    reject();
                });
        });
    }

    /**
     * Loads a story and it's comments
     * @param {String} url
     */
    async fetchStoryPromise(url) {
        return new Promise(async (resolve, reject) => {
            doFetch(url)
                .then(async (data) => {
                    // get only top 10 comments, if there are less then
                    // get them all
                    let commentIds = data.kids.length > MAX_COMMENTS ?
                        data.kids.slice(0, MAX_STORIES) : data.kids;

                    let urls = commentIds.map((id) => {
                        return ITEM_URL.replace('{id}', id)
                    });

                    let values = await this.batchFetch(
                        urls,
                        this.fetchCommentPromise
                    );
                    data.comments = values;
                    resolve(data)
                })
                .catch(() => {
                    reject();
                });
        });
    }

    /**
     * Loads story data and it's top n comments. see MAX_COMMENTS const.
     * Right now this loads all comments on the list but it can be
     * modified so it requests lazy loads the data.
     * @returns {Promise}
     */
    async getNextStories() {
        return new Promise(async (resolve, reject) => {
            if (!this.storyIds.length) {
                resolve([]);
            }

            let urls = this.storyIds.map((id) => {
                return ITEM_URL.replace('{id}', id)
            });
            let values;

            try {
                values = await this.batchFetch(urls, this.fetchStoryPromise);
            }
            catch(e) {
                console.error(e);
            } 

            try {
                resolve(values);
            }
            catch(e) {
                console.error(e);
            }
            
        });
    }

    /**
     * 
     * @param {Array} args arguments to pass to promiseBuilder method
     * @param {Method} fetchPromiseBuilder Builds a specific fetch promise
     */
    buildPromiseList(args, fetchPromiseBuilder) {
        let promises = [];

        for (let arg of args) {
            promises.push(fetchPromiseBuilder.call(this, arg));
        }

        return promises;
    }

    /**
     * Fetches a list of urls.
     * It separates the url array into n number of chunks in order to send
     * less requests in a short period of time.
     * See PROMISE_CHUNK_SIZE
     * @param {Array} urls 
     * @param {Method} fetchPromiseBuilder Builds a specific fetch promise
     */
    async batchFetch(urls, fetchPromiseBuilder) {
        return new Promise(async (resolve, reject) => {
            let urlChunks = getArrayChunks(urls, PROMISE_CHUNK_SIZE);
            let results = [];

            // for of seems to be more stable than map and foreach
            for (let urlChunk of urlChunks) {
                let promises = this.buildPromiseList(
                    urlChunk,
                    fetchPromiseBuilder
                );
                let values = await Promise.all(promises);

                results.push(...values);
            }

            try{
                resolve(results);
            }
            catch(e) {
                console.error(e);
            }
        });
    }
}

export default DataManager;
