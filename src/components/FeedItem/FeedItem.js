import React from 'react';
import Comment from '../Comment/Comment';

import './FeedItem.css';

const FeedItem = ({item}) => (
    <div className='FeedItem'>
        <div className='content'>
        { console.log(item) }
            <p className='name'>{ item.by }</p>
            <p><a className='url' href={item.url} target='_blank'>{ item.title }</a></p>
        </div>
        <div className="comments">
            <span className='title'>comments:</span>
            <ul>
                {item.comments.map((comment, i) => {
                    return (
                        <Comment key={i} comment={comment} />
                    )
                })}
            </ul>
        </div>
    </div>
);



export default FeedItem;