import React from 'react';
import Comment from '../Comment/Comment';

import './FeedItem.css';

const FeedItem = ({item}) => (
    <div className='FeedItem'>
        <div className='content'>
            <p className='name'>posted by { item.by }</p>
            <p className='url'><a href={item.url} target='_blank'>{ item.title }</a></p>
        </div>
        <div className="comments">
            {(item.kids && item.kids.length) ? (<span className='title'>comments:</span>) : null}
            <ul>
                {item.comments.map((comment, i) => {
                    if (!comment.dead) {
                        return (
                            <Comment key={i} comment={comment} />
                        )
                    }
                })}
            </ul>
        </div>
    </div>
);



export default FeedItem;