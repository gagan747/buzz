/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable import/no-cycle */
import React, { useContext } from 'react';
import './Comments.css';
import AddComment from './AddComment.jsx';
import { commentContext } from './Post';
import Commentbox from './Commentbox';

export default function Comments() {
  const commentcontext = useContext(commentContext);
  const comments = commentcontext.commentsdata;
  return (
    <div className="comments">
      {comments.length === 0 ? <p style={{ textAlign: 'center' }} className="mt-3 pt-4">No comments found</p> : comments.map((comment) => <Commentbox key={comment._id} data={comment} />)}
      <AddComment />
    </div>
  );
}
