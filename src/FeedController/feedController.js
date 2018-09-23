
import Fetcher from './fetcher';
import listGenerator from './listGenerator';

/**
 * Feed Controller Class
 * Acts as a lazy load controller for the hacker news react app
 * 
 * API:
 * getStories {Function} returns Array
 */
class FeedController extends Object {

    /**
     * Constructor
     * @param {Object} config configuration object
     */
    constructor(config) {
        super();

        this.config = config;
        this.fetcher = new Fetcher(config.requests);
        this.storyIds = null;
        this.currentPage = 1;
        this.inProgress = false;
    }

    /**
     * Fetches stories from API by using an instance of the Fetcher class
     * @returns {Array}
     */
    async getStories() {

        if (this.inProgress) {
            throw Error('fetching request already in progress');
        }

        this.inProgress = true;

        // Load to story data if it hasn't been loaded
        if (!this.storyUrls) {
            try {
                // get list of top storyIds from the API
                let idList = await this.fetcher.makeRequest(
                    this.config.urls.topStories
                );
                // We only wants to process some of the ids
                let chunk = idList[0].slice(0, this.config.maxStories);
                // construct url array
                let urls = chunk.map((id) => {
                    return this.config.urls.item.replace('{id}', id);
                });

                // This allows us to get a n(config.storiesPerPage) number of
                // story urls from this list every time this method is invoked
                this.storyUrls = listGenerator(
                    urls,
                    this.config.storiesPerPage
                );
            }
            catch (err) {
                throw Error(err);
            }
        }

        let stories = [];
        let comments;
        // grab the next set of story urls to load
        let urls = this.storyUrls.next().value;

        // If there aren't any more url's then send null so the react app
        // knows that there's nothing else to show.
        if (!urls || !urls.length) {
            this.inProgress = false;
            return null;
        }

        // the fetcher instance returns an array containing the fetched items
        for (let story of await this.fetcher.makeRequest(urls)) {
            
            // the kids property is missing when there are no comments
            if (story.hasOwnProperty('kids')) {
                let commentIds = story.kids.slice(0, this.config.maxComments);
                let commentUrls = commentIds.map((id) => {
                    return this.config.urls.item.replace('{id}', id);
                });

                comments = await this.fetcher.makeRequest(commentUrls);
            }

            story.comments = comments || [];
            stories.push(story);
        }

        this.inProgress = false;

        return stories; 
    }
}

export default FeedController;
