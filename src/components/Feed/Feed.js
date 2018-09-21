import React, { Component } from 'react';
import FeedItem from '../FeedItem/FeedItem';

import './Feed.css';

class Feed extends Component {
    render() {
        return (
            <section
                className='Feed'>
                { this.props.model.map((item, i) => {
                    return (
                        <FeedItem key={i} item={item}/>
                    );
                }) }
            </section>
        );
    }
}

export default Feed;
