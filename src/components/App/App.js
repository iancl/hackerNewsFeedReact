import React, { Component } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Feed from '../Feed/Feed';
import DataManager from '../../tools/dataManager' 

import './App.css';

const year = (new Date()).getFullYear();

class App extends Component {
    constructor () {
        super();

        this.dataManager = new DataManager();
        this.state = {
            model: []
        };
    }

    /**
     * The dataManager will load the story ids here.
     * If this was successful then we'll load the details
     * for some of them
     */
    componentDidMount() {
        this.dataManager.loadTopStoryIds()
            .then(() => {
                this.getStoriesData();
            })
            .catch(() => {
                // do nothing here
            });   
    }

    getStoriesData() {
        this.dataManager.getNextStories()
        .then((model) => {
            this.state.model = model;
            this.setState({ model : this.state.model });
        })
        .catch(() => {
            console.error('problem getting data from API');
        });
    }

    render() {
        return (
            <div
                className='App'>
                    <Header />
                    <Feed model={this.state.model}/>
                    <Footer year={year}/>
            </div>
        );
    }
}

export default App;
