import React from 'react';

import './Comment.css';

const Comment = ({comment}) => (
    <li class='Comment'>
        <p className='by'>{ comment.by }</p>
        {/*
            I really couldn't find a way to unescape the comment.text string
        */}
        <p className="text">{ comment.text }</p>
    </li>
);

export default Comment;
