
import listGenerator from './listGenerator';

/**
 * Fetcher Class
 * Used to make batch fetch requests
 * 
 * API:
 * - makeRequest {Function} returns Array
 */
class Fetcher extends Object {
    constructor(config) {
        super();
        this.config = config;
    }

    /**
     * Returns the specified data param after the specified time
     * @param {Int} time 
     * @param {Object} data 
     */
    defer(time, data) {
        return new Promise((resolve, reject) => {
            if (time) {
                setTimeout(() => {
                    resolve(data);
                }, time);
            }
            else {
                resolve(data);
            }
        });
    }

    /**
     * Resolves the specified promise array after the specified delay
     * @param {*} delay 
     * @param {*} promises 
     */
    async execPromises(delay, promises) {
        return this.defer(
            delay,
            await Promise.all(promises)
        );
    }

    /**
     * Method that fetches the data returned by hitting every url on the array.
     * The provided url list will be processed by the listGenerator function
     * so that only makes a small # of request in parallel.
     * 
     * Once a set of requests is done it will wait some time(config.delay) and
     * then process the next set of urls returned by the generator.
     * @param {Array} urls
     * @returns {Array} The fetched data
     */
    async makeRequest(urls) {
        urls = Array.isArray(urls) ? urls : [urls];
        let list = listGenerator(urls, this.config.parallelRequestCount);
        let delay = urls.length === 1 ? 0 : this.config.delay * 1000;
        let data = [];

        for (let chunk of list) {
            let promises = chunk.map((url) => {
                return fetch(url);
            });
            let responses = await this.execPromises(delay, promises);

            for (let response of responses) {
                data.push(
                    await response.json()
                );
            }
        }

        return data;
    }
}

export default Fetcher;
