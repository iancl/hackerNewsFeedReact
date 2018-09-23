import Fetcher from './fetcher';
import listGenerator from './listGenerator';

class FeedController extends Object {
    constructor(config) {
        super();

        this.config = config;
        this.fetcher = new Fetcher(config.requests);
        this.storyIds = null;
        this.currentPage = 1;
        this.inProgress = false;
    }

    async getStories() {
        if (this.inProgress) {
            throw Error('fetching request already in progress');
        }

        this.inProgress = true;

        // Load to story data if it hasn't been loaded
        if (!this.storyUrls) {
            try {
                let idList = await this.fetcher.makeRequest(
                    this.config.urls.topStories
                );
                let chunk = idList[0].slice(0, this.config.maxStories);
                let urls = chunk.map((id) => {
                    return this.config.urls.item.replace('{id}', id);
                });

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
        let urls = this.storyUrls.next().value;

        if (!urls || !urls.length) {
            this.inProgress = false;
            return null;
        }

        for (let story of await this.fetcher.makeRequest(urls)) {
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