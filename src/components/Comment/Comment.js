import React from 'react';

import './Comment.css';

const Comment = ({comment}) => (
    <li class='Comment'>
        <p className='by'>{ comment.by }</p>
        <p className="text">{ unescape(comment.text) }</p>
    </li>
);

export default Comment;
