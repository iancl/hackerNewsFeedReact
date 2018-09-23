import React from 'react';

import './Comment.css';

/**
 * The comment properties are strings that contain html tags so they must be
 * inserted as html.
 * @param {String} strHtml 
 */
function createMarkup(strHtml) {
    return {__html: strHtml};
}

const Comment = ({comment}) => (
    <li className='Comment'>
        <p className='by'>comment by { comment.by }</p>
        <p className="text" dangerouslySetInnerHTML={createMarkup(comment.text)}></p>
    </li>
);

export default Comment;
