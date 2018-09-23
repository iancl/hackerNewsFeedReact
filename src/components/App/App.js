import React, { Component } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Feed from '../Feed/Feed';
import FeedController from '../../FeedController/feedController' 


import './App.css';

const year = (new Date()).getFullYear();
const config = require('../../../config.json');

/**
 * Utility function that sets text to a node
 * @param {HTMLElement} el 
 * @param {String} txt 
 */
function setText(el, txt) {
    if (el.textContent) {
        el.textContent = txt;
    }
    else {
        el.innerText = txt;
    }
}

/**
 * App Class
 * Main class of the react app
 */
class App extends Component {
    constructor () {
        super();

        this.feedController = new FeedController(config);
        this.state = {
            model: []
        };
        this.inProgress = false;
        this.complete = false;
        this.loadMoreItems = this.loadMoreItems.bind(this);
    }

    /**
     * Tells the feedController to start loading the stories here
     */
    componentDidMount() {
        // disable this now becuase if I disable at in the template then
        // the button will stop catching events for some reason.
        this.refs.loadMoreButton.setAttribute('disabled', true);
        this.getNextStories();
    }

    /**
     * Invokes the feedController.getStories method that will return the next
     * set of stories on the list.
     */
    getNextStories() {
        this.feedController.getStories()
        .then((model) => {
            if (!model) {
                this.complete = true;
                this.disableFeed();
                return;
            }

            this.state.model = this.state.model.concat(model);
            this.setState({ model : this.state.model });
            this.inProgress = false;
            this.unlockLoadMoreButton();
        })
        .catch((err) => {
            console.error('problem getting data from API: ', err);
        });
    }

    /**
     * Begins the process of loading more stories and changes the state
     * of the button to locked.
     */
    loadMoreItems() {
        if (this.inProgress) {
            return;
        }

        if (this.complete) {
            this.disableFeed();
            return;
        }

        this.lockLoadMoreButton();
        this.inProgress = true;
        this.getNextStories();
    }

    /**
     * Invoked when there are no more stories to load.
     */
    disableFeed() {
        let el = this.refs.loadMoreButton;
        el.setAttribute('disabled', true);
        setText(el, 'No More Items!');
    }

    unlockLoadMoreButton() {
        let el = this.refs.loadMoreButton;
        el.removeAttribute('disabled');
        setText(el, 'Load More!');
    }

    lockLoadMoreButton() {
        let el = this.refs.loadMoreButton;
        el.setAttribute('disabled', true);
        setText(el, 'Loading...');
    }

    render() {
        return (
            <div
                className='App'>
                    <Header />
                    <Feed model={this.state.model}/>
                    <footer className='feedFooter'>
                        <button 
                            onClick={this.loadMoreItems}
                            className='loadMore'
                            ref='loadMoreButton'>Loading...</button>
                    </footer>
                    <Footer year={year}/>
            </div>
        );
    }
}

export default App;
