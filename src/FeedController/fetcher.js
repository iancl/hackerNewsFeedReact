import listGenerator from './listGenerator';

class Fetcher extends Object {
    constructor(config) {
        super();
        this.config = config;
    }

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

    async excePromises(delay, promises) {
        return this.defer(
            delay,
            await Promise.all(promises)
        );
    }

    async makeRequest(urls) {
        urls = Array.isArray(urls) ? urls : [urls];

        let list = listGenerator(urls, this.config.parallelRequestCount);
        let delay = urls.length === 1 ? 0 : this.config.delay * 1000;
        let data = [];

        for (let chunk of list) {
            let promises = chunk.map((url) => {
                return fetch(url);
            });
            let responses = await this.excePromises(delay, promises);

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